const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');
const flash = require('connect-flash');
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));
app.use(flash());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
); 
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.get('/', (req,res) => {
    res.render('index');
});
app.post('/', async (req,res) => {
    const { url, format } = req.body;
    if(!url) {
        req.flash('error_msg', 'No URL provided');
        return res.redirect('/');
    }
    if(format === 'empty') {
        req.flash('error_msg', 'Please select format of PDF');
        return res.redirect('/');
    }
    createPDF(url,format).then(pdf => {
        req.flash('success_msg', 'Your PDF is ready!');
        return res.redirect('/')
    });
});
app.get('/download', (req,res) => {
    return res.download(path.join(__dirname,'public','pdf','web.pdf'));
})


const createPDF = async (url, format) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url,{waitUntil: 'networkidle0'});
        await page.emulateMedia('screen');
        const pdf = await page.pdf({
            path: path.join(__dirname,'public','pdf','web.pdf'),
            format: format,
            printBackground: true,
        });
        await browser.close();
        return pdf;
    } catch(error) {
        console.log(error);
    }
    

    
}


app.listen(process.env.PORT || 3000,process.env.IP, () => {  
    console.log('Server has started!');
});
