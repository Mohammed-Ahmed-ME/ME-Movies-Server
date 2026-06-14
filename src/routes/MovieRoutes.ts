import express from "express"
import {GetMovieLink,SetMovieLink} from "../Controllers/Movie.controller";
import {authenticateUser } from "../Middlewares/AuthMiddleware";
const MovieRoutes = express.Router()

MovieRoutes.get('/Get-Movie-Link', GetMovieLink)

MovieRoutes.post('/Set-Movie-Link', authenticateUser ,SetMovieLink)

export default MovieRoutes