import express from "express"
import {GetMovieLink,SetMovieLink} from "../Controllers/Movie.controller.ts";
import {authenticateUser } from "../Middlewares/AuthMiddleware.ts";
const MovieRoutes = express.Router()

MovieRoutes.get('/Get-Movie-Link', GetMovieLink)

MovieRoutes.post('/Set-Movie-Link', authenticateUser ,SetMovieLink)

export default MovieRoutes