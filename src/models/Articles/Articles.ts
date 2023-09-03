import customError from "../../utils/custom-error"
import articleErrors from '../../errors/article'
import Articles, { ArticleSchema, ArticleSchemaWithDocument } from "./schema"

export type {
    ArticleSchema,
    ArticleSchemaWithDocument
}

export const createNewArticle = async (doc: ArticleSchema): Promise<ArticleSchemaWithDocument> => {
    const article = new Articles(doc)

    return article.save()
}

export const getArticles = async (condition: object = {}): Promise<ArticleSchema[]> => {
    const articles = await Articles
        .find({
            ...condition,
            status: 'active'
        })
        .sort({
            createAt: -1
        })
        .lean<ArticleSchema[]>()

    return articles
}

export const getArticleById = async (articleId: string): Promise<ArticleSchema> => {
    try {
        const article = await Articles
            .findOne({
                _id: articleId,
                status: 'active'
            })
            .lean<ArticleSchema>()
        
        if( !article ) {
            customError(articleErrors.ArticleIdInvalid)
        }

        return article!
        
    } catch (error:any) {
        if(error.kind === 'ObjectId') {
            return customError(articleErrors.ArticleIdInvalid)
        
        } else if( error.name === 'CustomError' ) {
            return error
        }
        return customError(articleErrors.ArticleSomethingWentWrong)
    }
}

// export const updateArticleById = async (articleId: string, doc: ArticleSchema): Promise<boolean> => {
export const updateArticleById = async (articleId: string, doc: ArticleSchema): Promise<boolean> => {
    try {
        // To filter undefined value out
        // Object.keys(doc).filter(key => doc[key] ?? delete doc[key])

        // const filtered = Object.keys(doc)
        //     .filter(key => doc.includes(key))
        //     .reduce((obj, key) => {
        //         obj[key] = doc[key];
        //         return obj;
        //     }, {});
        
        const result = await Articles
            .updateOne({
                _id: articleId,
                status: {
                    $ne: 'deleted'
                }
            }, {
                $set: {
                    ...doc
                }
            })

        if( result.modifiedCount == 0 ) {
            customError(articleErrors.ArticleCannotUpdate)
        }

        return true
    } catch (error:any) {
        if(error.kind === 'ObjectId') {
            customError(articleErrors.ArticleIdInvalid)
        } else if( error.name === 'CustomError' ) {
            error
        }
        customError(articleErrors.ArticleSomethingWentWrong)

        return false
    }
}

export const softDeleteArticleById = async (articleId: string): Promise<boolean> => {
    try {
        await Articles
            .findByIdAndUpdate(articleId, {
                $set: {
                    status: 'deleted'
                }
            })
        return true
    } catch (error) {
        customError(articleErrors.ArticleSomethingWentWrong)
        return false
    }
}

export default {
    createNewArticle,
    getArticles,
    getArticleById,
    updateArticleById,
    softDeleteArticleById
}