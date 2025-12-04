import { nanoid } from "nanoid";
import { URL } from "../models/url.models.js";

//Create a Short URL
export const createShortUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if(!originalUrl) {
            return res.status(400).json({message:' URL is required'});
        }

        const existingUrl = await URL.findOne({originalUrl});
        if(existingUrl) {
            return res.json({
                message:'URL already exist',
                originalUrl:existingUrl.originalUrl,
                shortUrl:`http://localhost:4000/${existingUrl.shortId}`
            })
        }

        const shortId = nanoid(8);

        const newUrl = await URL.create({
            originalUrl,
            shortId
        });

        res.status(201).json({
            shortUrl:`http://localhost:4000/${existingUrl.shortId}`
        });
    } catch (error) {
        res.status(500).json({message:error.message || 'server error'});
    }
};

//Redirect to Original Url
export const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortId } = req.params;
        const urlDc = await URL.findOne({shortId});
        if(!urlDc) {
            return res.status(404).json({message:'URL not found'})
        }

        urlDc.clicks++;
        await urlDc.save();

        return res.redirect(urlDc.originalUrl);
    } catch (error) {
        res.status(500).send("Server Error")
    }
;}