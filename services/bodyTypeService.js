(function () {
    //var bust = 23, waist = 30, hip = 22;


    function calculateBodyType(bust, waist, hip) {
        var bVal = bust,
            wVal = waist,
            hVal = hip;

        var cont = 0;

        // for (var c = 1; c <= 8; c++) {
        //     $('#s' + c).css('opacity', 100);
        // }



        if ((parseFloat(bVal) < parseFloat(wVal)) && (parseFloat(wVal) < parseFloat(hVal))) {
            cont = "#Apple";//Diamond
        }
        else if ((parseFloat(bVal) == parseFloat(wVal)) && (parseFloat(wVal) == parseFloat(hVal)) && (parseFloat(bVal) == parseFloat(hVal))) {
            cont = "#Apple";//Oval
        }
        else if ((parseFloat(bVal) > parseFloat(wVal)) && (parseFloat(bVal) > parseFloat(hVal))) {
            cont = "#Inverted Triangle";//Inverted triangle
        }
        else if ((parseFloat(wVal) < parseFloat(bVal)) && (parseFloat(wVal) < parseFloat(hVal)) && ((parseFloat(bVal) + 2) > parseFloat(hVal))) {
            if ((parseFloat(bVal) == (parseFloat(wVal) + 1)) && (parseFloat(hVal) == (parseFloat(wVal) + 1))) {
                cont = "#Rectangle";//Straight or rectangle
            }
            else if ((parseFloat(bVal) == (parseFloat(wVal) + 2)) && (parseFloat(hVal) == (parseFloat(wVal) + 2))) {
                cont = "#Full Hourglass";//Hour glass
            }
            else {
                cont = "#Neat Hourglass";//Top Hourglass
            }
        }
        else if ((parseFloat(wVal) < parseFloat(bVal)) && (parseFloat(wVal) < parseFloat(hVal)) && (parseFloat(bVal) < parseFloat(hVal))) {
            if ((parseFloat(wVal) + 2) > parseFloat(bVal)) {
                cont = "#Pear";//Pear
            }
            else {
                cont = "#Rectangle";//Spoon
            }
        }
        else if ((parseFloat(bVal) == parseFloat(wVal)) && (parseFloat(wVal) < parseFloat(hVal)) && (parseFloat(bVal) < parseFloat(hVal))) {
            cont = "#Pear";//pear
        }
        else {
            var shpVal = 'Not matched';
            cont = "#Rejected";//cannot be determined
        }

        return new Promise(function (resolve, reject) {
            if (cont) {
                resolve(cont);
            }
            reject("error with body Type service");
        });


    }

    var bodyTypeServiceFunctions = {

        calculateBodyType: calculateBodyType
    }

    module.exports = {
        bodyTypeServiceFunctions: bodyTypeServiceFunctions
    }


})();