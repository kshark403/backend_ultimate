import { FastifyRequest } from "fastify";
import Articles, { ArticleSchemaWithDocument, ArticleSchema } from "../models/Articles";
import { ArticleRequestBody, ArticleParams, ArticleWithRequestBodyAndParams } from '../types/handlers/article'

export const handlePostCreateNew = async (request:any): Promise<ArticleSchemaWithDocument> => {
    const { userId } = request
    const { title, description, status } = request.body
//50.43
    const article = await Articles.createNewArticle({
        title,
        description,
        status: status ?? 'active',
        author: userId
    })

    return article
}

export const handleGetArticles = async (request: FastifyRequest): Promise<ArticleSchema[]> => Articles.getArticles()

export const handleGetArticleById = async (request: any): Promise<ArticleSchema> => {
    const { id } = request.params

    const article = await Articles.getArticleById(id)

    return article
}

export const handlePatchUpdateArticleById = async (request: any): Promise<string> => {
    const { userId } = request
    const { id } = request.params
    const { title, description, status } = request.body

    await Articles.updateArticleById(id, {
        title,
        description,
        status: status ?? 'active',
        author: userId
    })

    return 'OK'
}


export const handleDeleteArticleById = async (request: any): Promise<string> => {
    const { id } = request.params

    await Articles.softDeleteArticleById(id)

    return 'OK'
}

export default {
    handleGetArticles,
    handleGetArticleById,
    handlePostCreateNew,
    handlePatchUpdateArticleById,
    handleDeleteArticleById
}