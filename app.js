const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended:false}))

app.get('/', (req,res) => {
    res.render('index');
});
app.post('/', async (req,res) => {
    const url = req.body.url;
    if(!url) {
       return res.send('no url provided')
    }
    createPDF(url);
    return res.download(path.join(__dirname,'public','pdf','web.pdf'));
});


const createPDF = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log(typeof url);
    
        await page.goto(url,{waitUntil: 'networkidle2'});
        await page.emulateMedia('screen');
        await page.pdf({
            path: path.join(__dirname,'public','pdf','web.pdf'),
            format: 'A4',
            printBackground: true
        });
        await browser.close();
    } catch(error) {
        console.log(error);
    }
    

    
}


app.listen(process.env.PORT || 3000,process.env.IP, () => {  
    console.log('Server has started!');
});
