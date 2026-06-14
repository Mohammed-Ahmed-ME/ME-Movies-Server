import * as mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
        minLength: 1,
        maxLength: 255,
        validator: {
            validator: function(value: string) {
                return /^[a-zA-Z0-9\s]+$/.test(value);
            },
            message: 'Title must only contain letters, numbers, and spaces'
        }
    },
    year: {
        type:Number,
        required: true,
        validate: {
            validator: function(value: number) {
                return value >= 1900 && value <= new Date().getFullYear();
            },
            message: 'Year must be between 1900 and the current year'
        }
    },
    tmdbId: Number,
    linked: {
        type:Boolean,
        default: false,
        required: true,
        validate: {
            validator: function(value: boolean) {
                return value === true || value === false;
            },
            message: 'Linked must be a boolean value'
        }
    },
    linkURL: {
    type:String,
    required: function() {
        return this.linked;
    }},
})
const MovieModel = mongoose.model('Movie', MovieSchema);
export default MovieModel