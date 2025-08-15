const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');

app.use(express.json());
app.use(cors());

const fs = require('fs');

const read = (filePath) =>{
  return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

app.get('/characters', async (req, res) => {
  const dataSend = await read('data/characters.json');
  res.send(dataSend.characters);
});

app.get('/characters/:value', async (req, res) => {
  const dataSend = await read('data/characters.json');
  const index = parseInt(req.params.value, 10);
  if (index > 0 && index <= Object.keys(dataSend.characters).length){
    res.send(dataSend.characters[index - 1]);
  }
  else {
    res.json({ message: 'Invalid id'});
  }
});

app.delete('/characters/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('data/characters.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');

    let obj = JSON.parse(data);
    const index = obj.characters.findIndex(char => char.id === id);

    if (index !== -1) {
      obj.characters.splice(index, 1);
      fs.writeFile('data/characters.json', JSON.stringify(obj, null, 2), (err) => {
        if (err) return res.status(500).send('Error writing file');

        res.status(200).json({ message: 'Deleted', characters: obj.characters });
      });
    } else {
      res.status(404).send('Invalid id');
    }
  });
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


// POST /characters ==> Create a new character
// PUT /characters/:id ==> Update a character by ID