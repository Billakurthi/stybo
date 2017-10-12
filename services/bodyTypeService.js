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
            cont = 1;//Diamond
        }
        else if ((parseFloat(bVal) == parseFloat(wVal)) && (parseFloat(wVal) == parseFloat(hVal)) && (parseFloat(bVal) == parseFloat(hVal))) {
            cont = 2;//Oval
        }
        else if ((parseFloat(bVal) > parseFloat(wVal)) && (parseFloat(bVal) > parseFloat(hVal))) {
            cont = 3;//Inverted triangle
        }
        else if ((parseFloat(wVal) < parseFloat(bVal)) && (parseFloat(wVal) < parseFloat(hVal)) && ((parseFloat(bVal) + 2) > parseFloat(hVal))) {
            if ((parseFloat(bVal) == (parseFloat(wVal) + 1)) && (parseFloat(hVal) == (parseFloat(wVal) + 1))) {
                cont = 4;//Straight or rectangle
            }
            else if ((parseFloat(bVal) == (parseFloat(wVal) + 2)) && (parseFloat(hVal) == (parseFloat(wVal) + 2))) {
                cont = 5;//Hour glass
            }
            else {
                cont = 6;//Top Hourglass
            }
        }
        else if ((parseFloat(wVal) < parseFloat(bVal)) && (parseFloat(wVal) < parseFloat(hVal)) && (parseFloat(bVal) < parseFloat(hVal))) {
            if ((parseFloat(wVal) + 2) > parseFloat(bVal)) {
                cont = 7;//Pear
            }
            else {
                cont = 8;//Spoon
            }
        }
        else if ((parseFloat(bVal) == parseFloat(wVal)) && (parseFloat(wVal) < parseFloat(hVal)) && (parseFloat(bVal) < parseFloat(hVal))) {
            cont = 7;//pear
        }
        else {
            var shpVal = 'Not matched';
            cont = 9;//cannot be determined
        }

        return cont;


    }

    var bodyTypeServiceFunctions = {

        calculateBodyType: calculateBodyType
    }

    module.exports = {
        bodyTypeServiceFunctions: bodyTypeServiceFunctions
    }


})();