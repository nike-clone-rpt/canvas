const express = require('express');
const {Shoe_Images} = require('../database/schemas.js');
const app = express();
const port = 1121;

app.use(express.urlencoded());
app.use(express.json());

app.use(express.static(__dirname + '/../client/dist'))

app.get('/api/images', (req, res) => {
  let shoe = req.query.shoe_id;
  res.setHeader('access-control-allow-origin', '*');
  Shoe_Images.findOne({shoe_id: shoe}).then((shoeImage) => {
    if (!shoeImage) {
      res.send('This shoe does not exist!');
    } else {
      res.json([shoeImage.img1,shoeImage.img2,shoeImage.img3,shoeImage.img4,shoeImage.img5]);
    }
  })
})

app.get('/api/recommendedImage', (req, res) => {
  let shoes = req.query.shoesArr;
  let error;
  let imgArr = [];
  res.setHeader('access-control-allow-origin', '*');
  shoes.forEach((shoe, i) => {
    let id = parseInt(shoe);
    Shoe_Images.findOne({shoe_id: id}).then((shoeImage) => {
      if (!shoeImage) {
        error = 'At least one of the shoes does not exist!';
      } else {
        imgArr.push(shoeImage.img1)
      }
      if (i === shoes.length-1) {
        if (!error){
          res.json(imgArr);
        } else {
          res.send(error);
        }
      }
    })
  });

})

app.listen(port, () => {
  console.log(`Image server is running on http://18.207.197.100:${port}/`);
})