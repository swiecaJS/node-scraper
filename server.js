var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {

  //simple json response
  // res.setHeader('Content-Type', 'application/json');
  // res.send(JSON.stringify({ a: 1 }, null, 3));


  const url = 'https://cracovia.pl/hokej/slizgawki';

  request(url, function(err, response, html) {
    if (!err) {
      const $ = cheerio.load(html);

      const dataFromPage = [];

      $('p').each(function(i, elem) {
        dataFromPage[i] = $(this).text();
      });

      //extract only data with dates (regex does not work properly)
      var firstThing = dataFromPage[0]
      var firstIndex = dataFromPage.indexOf(firstThing, 1);
      var secondIndex = dataFromPage.indexOf(firstThing, firstIndex + 1);

      const cleanedData = dataFromPage.slice(firstIndex + 1, secondIndex);
      console.log('****OUTPUT2****');


      //use regex to check if multiple dates in one line
      const reg = /\d{2}.\d{2}.\d{4}/gi;
      const processedData = [];

      cleanedData.map(el => {
        console.log(el)
        let match = el.match(reg);
        console.log(match);
        console.log(match.length);

        if (match.length == 1) {
          processedData.push(el)
        } else {
          for (let i = 0; i < match.length - 1; i++) {
            var firstIndex = el.indexOf(match[i]);
            var secondIndex = el.indexOf(match[i + 1]);
            if (secondIndex == -1) {
              secondIndex = 0;
            }
            console.log(el.slice(firstIndex, secondIndex));
            processedData.push(el.slice(firstIndex, secondIndex));
          }

        }

      })

      //remove everything that not dataFromPage
      // var reg = /\(.*?\)/gi;
      // var cleanedData = [];
      //
      // dataFromPage.map(element => {
      //   console.log(element)
      //   if(reg.test(element)){
      //     console.log('passed!');
      //     cleanedData.push(element);
      //   }
      // })


      //use regex to check if multiple dates in one line




      fs.writeFile('output.json', JSON.stringify(processedData, null, 4), function(err) {
        console.log('File successfully written! - Check your project directory for the output.json file');
      });
      // fs.writeFile('cleaned.json', JSON.stringify(cleanedData, null, 4), function(err) {
      //   console.log('File successfully written! - Check your project directory for the cleaned.json file');
      // });



      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(processedData));
    }
  })

})

app.listen('8081')

console.log('Magic happens on port 8081');
console.log('*****************************');

exports = module.exports = app;