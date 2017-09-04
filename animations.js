var border = 5;
var margin = 10;
var fps = 60;
var timeBetweenFrames = 1000/fps;

var p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y;

var correctY;

var x1, y1, r1, angle, slope;

var count, goingUp, otherCount, waitCount, maxPageScroll, maxScrollBarTop;

var animating = false;

var axeHeight;


function f(x1, y1, x2, y2, x) {
    return y2 - Math.sqrt(Math.pow(y1 - y2, 2) * (1 - Math.pow(x - x1, 2) / Math.pow(x1 - x2, 2)));
}

function fPrime(x1, y1, x2, y2, x) {
    var p1 = Math.pow(x1 - x2, 2);
    var p2 = Math.pow(y1 - y2, 2);
    return (p2 / p1) * (x - x1) / Math.sqrt(p2 * (1 - Math.pow(x - x1, 2) / p1));
}

function g(x1, y1, x2, y2, x) {
    return y1 + Math.sqrt(Math.pow(y1 - y2, 2) * (1 - Math.pow(x - x2, 2) / Math.pow(x2 - x1, 2)));
}

function gPrime(x1, y1, x2, y2, x) {
    var p1 = Math.pow(x2 - x1, 2);
    var p2 = Math.pow(y1 - y2, 2);
    return (p2 / p1) * (x - x2) / Math.sqrt(p2 * (1 - Math.pow(x - x2, 2) / p1));
}

function i(x1, y1, x2, y2, x) {
    return y2 + Math.sqrt(Math.pow(y2 - y1, 2) * (1 - Math.pow(x - x1, 2) / Math.pow(x2 - x1, 2)));
}

function iPrime(x1, y1, x2, y2, x) {
    var p1 = Math.pow(x2 - x1, 2);
    var p2 = Math.pow(y2 - y1, 2);
    return (p2 / p1) * (x - x1) / Math.sqrt(p2 * (1 - Math.pow(x - x1, 2) / p1));
}



var scrollBar, mainPageHeight, newbody, mainpage, select, navBar, ul, title, button, canvas, ctx;

var interval, numberOfFrames = 100, distPerFrame = 10;
//var distPerFrame = 2;
var currentX, currentY;

$(document).ready(function() {
    currentX = 0;
    select = $('select:first');
    scrollBar = $('#scrollBar');
    navBar = $('nav:first');
    ul = $('ul:first');
    newbody = $('#newbody');
    mainpage = $('#mainpage');
    title = $('#title');
    button = $('button:first');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');


    //document.getElementsByTagName('button')[0].addEventListener('click', animate);

    $(button).click(animate);

    $(window).resize(resizeFunction);
    $(newbody).scroll(scrollFunction);

    resizeFunction();
});

function resizeFunction() {

    if (animating) {
        clearInterval(interval);
        $(newbody).scrollTop(0);
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        $(canvas).css('z-index', -1);
        animating = false;
        distPerFrame = 10;
    }

    mainPageHeight = $(mainpage).height();

    //navBar stuff
    if ($(navBar).width() < 700) {
        $(ul).hide();
        $(select).show();
    } else {
        $(select).hide();
        $(ul).show();
    }
    var top = 26-($(title).height())*1.27;
    $(title).css('top', top + 'px');
    top = (50-$(select).height())/2;
    $(select).css('top', top + 'px');

    //canvas resizing
    var canvas = document.getElementById('canvas');
    canvas.height = $(window).height();
    canvas.width = $(window).width();

    //scroll bar resizing
    var height = $(window).height() * $(window).height() / mainPageHeight - 2 * border - 2 * margin;
    $(scrollBar).height(height);
    scrollFunction();

    //canvas equations
    p1x = .8 * $(window).width();
    p1y = .05 * $(window).height();
    p2x = .6 * $(window).width();
    p2y = .6 * $(window).height();
    p3x = .5 * (p4x + p2x);
    p3y = .95 * $(window).height();
}

function scrollFunction() {
    if (animating == false) {
        clearInterval(interval);
        var position = $(scrollBar).position();
        p4y = .5 * $(scrollBar).height() + position.top;
        p4x = position.left;
        var mainPagePaddingTop = 55;
        var totalHeight = $(mainpage).height() + mainPagePaddingTop + 2 * border;
        var top = $(newbody).scrollTop();
        var scrollBarHeight = $(scrollBar).height();
        var scrollTop = top * ($(window).height() - scrollBarHeight - 2 * border - 2 * margin) / (totalHeight - $(window).height());
        $(scrollBar).css('top', scrollTop + 'px');
    }
}

function animate() {
    var position = $(scrollBar).position();
    axeHeight = $(window)/40;
    p4y = .5 * $(scrollBar).height() + position.top + 20;
    p4x = position.left;
    p3y = p4y + .05 * $(window).height();
    $(canvas).css('z-index', 2);

    var a = p2y - p1y;
    var b = p1x - p2x;
    var h = Math.pow((a - b), 2) / Math.pow((a + b), 2);
    var p = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    var arcLength = p / 4;
    //var arcLength = Math.PI / 2 * Math.sqrt((Math.pow(p1y - p2y, 2) + Math.pow(p1x - p2x, 2))/2);
    //distPerFrame = arcLength / numberOfFrames;


    currentX = p1x;
    currentY = p1y;
    animating = true;
    interval = setInterval(function(){animateLoop(p1x, p1y, p2x, p2y, f, fPrime, -1);}, timeBetweenFrames);
}

function animateLoop(a, b, c, d, func, funcPrime, multiplier) {



    if (currentX != c) {
        distPerFrame *= 1.018;
        ctx.lineWidth = 5;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(p1x, p1y);

        var yPrime = -1 * funcPrime(a, b, c, d, currentX);

        if (yPrime == Infinity) {
            yPrime = -.01;
        }


        currentX = multiplier * Math.sqrt(Math.pow(distPerFrame, 2)/(Math.pow(yPrime, 2) + 1)) + currentX;


        if (a > c) {
            if (currentX < c) {
                currentX = c;
            }
        } else {
            if (currentX > c) {
                currentX = c;
            }
        }

        currentY = func(a, b, c, d, currentX);

        ctx.lineTo(currentX, currentY);

        slope = (currentY - p1y) / (currentX - p1x);
        angle = (slope > 0) ? Math.atan(slope) + Math.PI : (slope != 0) ? Math.atan(slope) + 2 * Math.PI : 3 * Math.PI / 2;
        r1 = .1 * $(window).height();
        x1 = (slope > 0) ? currentX - Math.sqrt(Math.pow(r1, 2)/(1 + Math.pow(slope, 2))) : currentX + Math.sqrt(Math.pow(r1, 2)/(1 + Math.pow(slope, 2)));
        y1 = currentY + slope * (x1 - currentX);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x1, y1, r1, angle + 5 * Math.PI / 6, angle + 7 * Math.PI / 6);



        ctx.stroke();
    } else {
        clearInterval(interval);

        if (currentX == p2x) {
            currentX = p2x + .1;
            var a = p3y - p2y;
            var b = p2x - p3x;
            var h = Math.pow((a - b), 2) / Math.pow((a + b), 2);
            var p = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
            var arcLength = p / 4;
            //var arcLength = Math.PI / 2 * Math.sqrt((Math.pow(p1y - p2y, 2) + Math.pow(p1x - p2x, 2))/2);
            //distPerFrame = arcLength / 100;
            //distPerFrame = .5;
            interval = setInterval(function(){animateLoop(p2x, p2y, p3x, p3y, g, gPrime, 1);}, timeBetweenFrames);
        } else if (currentX == p3x) {
            currentX = p3x + .6;
            var a = p4y - p3y;
            var b = p3x - p4x;
            var h = Math.pow((a - b), 2) / Math.pow((a + b), 2);
            var p = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
            var arcLength = p / 4;
            //var arcLength = Math.PI / 2 * Math.sqrt((Math.pow(p1y - p2y, 2) + Math.pow(p1x - p2x, 2))/2);
            //distPerFrame = arcLength / numberOfFrames;
            interval = setInterval(function(){
                animateLoop(p3x, p3y, p4x, p4y, i, iPrime, 1);
            }, timeBetweenFrames);
        } else if (currentX == p4x) {
            currentX = p1x;
            distPerFrame = $(window).width()/700;
            setTimeout(interval = function(){
                interval = setInterval(function(){
                    animateLoop2();
                }, timeBetweenFrames);
            }, 500);
        }

    }


    function animateLoop2() {
        if (currentX != p4x) {
            ctx.lineWidth = 5;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            currentX += distPerFrame;
            if (currentX > p4x) {
                currentX = p4x;
            }
            ctx.beginPath();
            ctx.moveTo(currentX, p1y);
            ctx.lineTo(p4x, p4y);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x1, y1, r1, angle + 5 * Math.PI / 6, angle + 7 * Math.PI / 6);
            ctx.stroke();

        } else {
            clearInterval(interval);
            if (currentX == p4x) {
                currentY = 0;
                distPerFrame = $(window).height()/1200;
                count = 0;
                goingUp = true;
                otherCount = 0;
                waitCount = 50;
                maxPageScroll = $(newbody).scrollTop();
                maxScrollBarTop = $(scrollBar).position().top;
                //maxScrollBarTop = maxScrollBarTop.substr(0, maxScrollBarTop.length - 2);
                correctY = p4y;
                setTimeout(interval = function(){
                    interval = setInterval(function(){
                        animateLoop3();
                    }, timeBetweenFrames);
                }, 500);
            }
        }
    }

    function animateLoop3() {
        var dist = $(window).height() / 10;
        var waitTime = 60;
        if (count < 3) {
            ctx.lineWidth = 5;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (goingUp) {
                currentY = currentY + distPerFrame;
                if (currentY > dist) {
                    if (otherCount < 12) {
                        var randomNumber = Math.random() * 2 + 3;
                        if (Math.random() < .5)
                            randomNumber *= -1;
                        currentY = dist + randomNumber;
                        otherCount++;
                    } else if (count < 2 ) {
                        currentY = dist;
                        otherCount = 0;
                        goingUp = false;
                    } else {
                        count++;
                    }
                }
            } else {
                if (waitCount < waitTime) {
                    waitCount++;
                    if (waitCount == waitTime) {
                        goingUp = true;
                    }
                }
                else {
                    currentY = currentY - 10 * distPerFrame;
                    if (currentY <= 0) {
                        currentY = 0;
                        count++;
                        waitCount = 0;
                    }
                }
            }
            ctx.beginPath();
            ctx.moveTo(p4x, p1y - currentY);
            ctx.lineTo(p4x, correctY - currentY);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x1, y1 - currentY, r1, angle + 5 * Math.PI / 6, angle + 7 * Math.PI / 6);
            ctx.stroke();
            //$(newbody).scrollTop(maxPageScroll - 4.5 * currentY);
            //$(scrollBar).scrollTop(maxScrollBarTop - currentY);
            var tempScrollTop = maxScrollBarTop - currentY;
            var scrollBarHeight = $(scrollBar).height();
            var mainPagePaddingTop = 55;
            var totalHeight = $(mainpage).height() + mainPagePaddingTop + 2 * border;
            var tempTop = tempScrollTop * (totalHeight - $(window).height()) / ($(window).height() - scrollBarHeight - 2 * border - 2 * margin);
            $(newbody).scrollTop(tempTop);
            $(scrollBar).css('top', tempScrollTop + 'px');
        } else {
            clearInterval(interval);
            distPerFrame = $(window).height()/40;
            setTimeout(interval = function(){
                interval = setInterval(function(){
                    animateLoop4();
                }, timeBetweenFrames);
            }, 100);
        }
    }

    function animateLoop4() {
        if (currentY < $(window).height()) {
            distPerFrame *= 1.01;
            ctx.lineWidth = 5;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            currentY += distPerFrame;
            ctx.beginPath();
            ctx.moveTo(p4x, p1y - currentY);
            ctx.lineTo(p4x, correctY - currentY);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x1, y1 - currentY, r1, angle + 5 * Math.PI / 6, angle + 7 * Math.PI / 6);
            ctx.stroke();
            //$(newbody).scrollTop(thing);
            //$(scrollBar).scrollTop(thing);
            var tempScrollTop = maxScrollBarTop - currentY;
            if (tempScrollTop < 0) {
                tempScrollTop = 0;
            }
            var scrollBarHeight = $(scrollBar).height();
            var mainPagePaddingTop = 55;
            var totalHeight = $(mainpage).height() + mainPagePaddingTop + 2 * border;
            var tempTop = tempScrollTop * (totalHeight - $(window).height()) / ($(window).height() - scrollBarHeight - 2 * border - 2 * margin);
            $(newbody).scrollTop(tempTop);
            $(scrollBar).css('top', tempScrollTop + 'px');
        } else {
            clearInterval(interval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $(canvas).css('z-index', -1);
            animating = false;
            distPerFrame = 10;
        }
    }

}