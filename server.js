const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());
app.use(cors());


app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/', function(req, res){
    res.render("index");
});

app.get("/:username", async (req, res) => {
  const username = req.params.username;
  const url = `https://www.codechef.com/users/${username}/`;
  let maxRank = null;
  let curRank = null;

  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error('User not found or page not accessible');
    }

    const $ = cheerio.load(response.data);
    // console.log(response.data);
    
    const ratingNumber = $('.rating-number').text().trim();
    const ratingHeader = $('.rating-header').text().trim();
    let problemSolved = $('section.rating-data-section h3').text().trim();
    let participation = $('.contest-participated-count b').text().trim();
    problemSolved = problemSolved.split(":")[1].trim();
    let globalRank = $('.rating-ranks strong').first().text().trim();
    let countryRank = $('.rating-ranks strong').eq(1).text().trim();
    
    
    if (ratingNumber && ratingHeader) {
      const smallTag = $('.rating-header small').text().trim();
      const numericValue = smallTag.match(/\d+/);

      curRank = ratingNumber;
      maxRank = numericValue ? numericValue[0] : null;
    }

    res.json({ currentRank: curRank,
               maxRank: maxRank,
              participatedContest: participation,
              problemSolved: problemSolved,
              globalRank: globalRank,
              countryRank: countryRank
    });
  } catch (error) {
    console.log('Error fetching the page:', error);
    res.status(404).json({ error: 'User not found or page not accessible' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port);
