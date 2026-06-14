import {AppError,AppSuccess} from "../utils/Res";
import MovieModel from "../Models/MovieModel"
import {Request, Response} from "express";

export const GetMovieLink = async (req: Request, res: Response) => {
    const params = req.query.id;
    console.log(params)
    const id = req.query.id;
    if(!id) return AppError(res, 400, "Movie Id Dose not provided");
    const movie =  await MovieModel.findOne({ tmdbId: id });
    if (!movie) return AppError(res, 404, "we couldn't find Movie Link with this id");
    return AppSuccess(res, 200, "Movie found", movie);
}

export const SetMovieLink = async (req: Request, res: Response) => {
    const movie = req.body;
    if(!movie) return AppError(res, 400, "Movie Dose not provided");
    const newMovie = await MovieModel.create(movie);
    const save = await newMovie.save();
    if (!save) return AppError(res, 500, "Movie not created");
    return AppSuccess(res, 201, "Movie created", newMovie);
}
