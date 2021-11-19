var express = require('express');
var router = express.Router();

//import niza
var gradovi_drzave = require("../glavniGradoviSvijeta");

//dodatne informacije o drzavi
var countriesInfo = require('countries-information');


var weather = require('openweather-apis');
weather.setUnits('metric');
weather.setAPPID("87f33db574b6aaf33b839760199231ab");
weather.setCity("Sarajevo");
weather.setLang('hr');
weather.setCoordinate(43.8486, 18.3564);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {  });
});


var trenutnaTemperatura;
var trenutniPritisak;
var opisVremena;


router.get('/sarajevo', function(req, res, next) {
  weather.setUnits('metric');

  weather.getTemperature(function(err, temp){
     trenutnaTemperatura = temp;
     weather.getPressure(function(err, pres){
       trenutniPritisak = pres;
        weather.getDescription(function(err, desc){
          opisVremena = desc;
        });
     });
  });

  res.render('sarajevo', { temp: trenutnaTemperatura,
                                       pritisak: trenutniPritisak,
                                       opis: opisVremena
  });
});




router.get('/:grad/:drzava', function(req, res, next) {
  var imeGrada = req.params.grad;
  var imeDrzave = req.params.drzava;

  weather.setCity(imeGrada + "," + imeDrzave);
  weather.setLang(imeDrzave);

  weather.getTemperature(function(err, temp){
    trenutnaTemperatura = temp;
      weather.getPressure(function(err, pres){
          trenutniPritisak = pres;
          weather.getDescription(function(err, desc){
              opisVremena = desc;
          });
      });
  });


  res.render('grad', { temp: trenutnaTemperatura,
                                   pritisak: trenutniPritisak,
                                   opis: opisVremena,
                                   grad: imeGrada
  })
});




//nakon refresha radi
var triDana;
router.get('/tridana/:grad/:drzava', function(req, res, next) {

  let grad = req.params.grad;
  let drzava = req.params.drzava;

  weather.setCity(grad);
  weather.setLang(drzava);
  weather.setUnits('metric');

  weather.getSmartJSON(function(err, smart) {
      triDana = smart;
      console.log(triDana);
  });

  res.render('threedaysforecast', { prognoza: triDana,
                                                grad: grad
  })

});






router.get('/forma/:grad/:drzava', function(req, res, next) {
    weather.setUnits('metric');

    weather.getTemperature(function(err, temp){
        trenutnaTemperatura = temp;
        weather.getPressure(function(err, pres){
            trenutniPritisak = pres;
            weather.getDescription(function(err, desc){
                opisVremena = desc;
            });
        });
    });


  res.render('form', { temp: trenutnaTemperatura,
                                   pritisak: trenutniPritisak,
                                   opis: opisVremena
  });

});

router.post('/posalji', function(req, res, next) {
    let grad = req.body.grad;
    let drzava = req.body.drzava;

    switch(drzava) {
        case "Bosna i Hercegovina":
            drzava = "BA";
            break;
        case "Francuska":
            drzava = "FR";
            break;
        case "Engleska":
            drzava = "GB";
            break;
        case "Holandija":
            drzava = "NL";
            break;
        case "Hrvatska":
            drzava = "";
            break;
        case "Turska":
            drzava = "TR";
            break;
        case "Italija":
            drzava = "IT";
            break;

    }

    res.redirect('/' + grad + "/" + drzava);
});




router.get('/sestizadatak/:grad/:drzava', function(req, res, next) {
    var imeGrada = req.params.grad;
    var imeDrzave = req.params.drzava;


    let dodatniPodaci = countriesInfo.getCountryInfoByName(imeDrzave);
    let pozivniBroj = dodatniPodaci.countryCallingCodes;
    let valuta = dodatniPodaci.currencies;

    console.log(dodatniPodaci);

    weather.setCity(imeGrada);
    weather.setLang(imeDrzave);

    weather.getTemperature(function(err, temp){
        trenutnaTemperatura = temp;
        weather.getPressure(function(err, pres){
            trenutniPritisak = pres;
            weather.getDescription(function(err, desc){
                opisVremena = desc;
            });
        });
    });

    //dobijamo grad na osnovu drzave, tj na osnovu odgovarajuceg indeksa
    let grad;
    for(let i=0; i<gradovi_drzave.length; i++) {
        if(gradovi_drzave[i].country == imeDrzave) {
            grad = gradovi_drzave[i].city;
            console.log(grad);
        }
    }


    res.render('zanimljivosti', { temp: trenutnaTemperatura,
        pritisak: trenutniPritisak,
        opis: opisVremena,
        grad: grad,
        pozivniBroj: pozivniBroj,
        valuta: valuta,
        gradovi_drzave: gradovi_drzave,


    })
});



router.get('/sestizadatak', function(req, res, next) {
    weather.getTemperature(function(err, temp){
        trenutnaTemperatura = temp;
        weather.getPressure(function(err, pres){
            trenutniPritisak = pres;
            weather.getDescription(function(err, desc){
                opisVremena = desc;
            });
        });
    });

    res.render('forma2', {gradovi_drzave: gradovi_drzave,
                                      temp: trenutnaTemperatura,
                                      pritisak: trenutniPritisak,
                                      opis: opisVremena
    })
});



router.post('/salji', function(req, res, next) {
    let grad = req.body.grad;
    let drzava = req.body.drzava;

    switch(drzava) {
        case "Bosna i Herzegovina":
            drzava = "BA";
            break;
        case "France":
            drzava = "FR";
            break;
        case "Engleska":
            drzava = "GB";
            break;
        case "Holandija":
            drzava = "NL";
            break;
        case "Hrvatska":
            drzava = "";
            break;
        case "Turska":
            drzava = "TR";
            break;
        case "Italija":
            drzava = "IT";
            break;

    }

    res.redirect('/sestizadatak/' + grad + '/' + drzava);
});


module.exports = router;
