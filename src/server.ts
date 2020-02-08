import express from 'express';
import { Response, Request } from "express";
import bodyParser from 'body-parser';
import * as validator from 'express-validator';

import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  const { query, validationResult } = validator;

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredimage", [
    query('image_url')
      .trim()
      .isURL()
  ], async ( req: Request, res: Response) => {

    // Check validation errors
    const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
    // Filter Image

    const imageUrl = req.query.image_url;

    let filteredImgPath: string;
    try{
      filteredImgPath = await filterImageFromURL(imageUrl);
    } catch(err){
      console.log(err);
    }

    // Send file in response
    res.sendFile(filteredImgPath, (err: Error) => {
      if(err){
        console.log(err);
      } else {
        deleteLocalFiles([filteredImgPath])
      }
    });
  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
