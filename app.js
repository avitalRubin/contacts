const express = require('express');
const app = express();
const fs = require('fs')
const cors = require('cors');

app.use(cors({origin: (origin, callback) => callback(null, true), optionsSuccessStatus: 200, credentials: true}));

app.get('/get_contact_list', function (req, res) {
    const data = fs.readFileSync("./contacts_data.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        try {
            return JSON.parse(jsonString);
        } catch (err) {
            console.log("Error parsing JSON string:", err);
        }
    });
    res.send(data);
});

app.get('/remove_contact/:contact_id', function (req, res) {
    const contact_to_remove = req.params.contact_id;
    console.log('remove contect ' + contact_to_remove)
    fs.readFile("./contacts_data.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        try {
            const contacts_obj = JSON.parse(jsonString);
            const index = contacts_obj.contacts.findIndex(a=> a.Id == contact_to_remove);
            if (index > -1) {
                contacts_obj.contacts.splice(index, 1);
                fs.writeFileSync('./contacts_data.json', JSON.stringify(contacts_obj, null, 2));
            }
            else
                console.log('contact not found')

        } catch (err) {
            console.log("Error parsing JSON string:", err);
        }
    });
    res.send('contact ' + contact_to_remove + ' been removed!');
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});