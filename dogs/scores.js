

function average(arr){
    var total = 0;
arr.forEach(function(score) {
total += score;    
});
var average = total / arr.length;
console.log(Math.round(average));
}

var scores = [12, 12, 32, 23, 76, 45, 76];

var scores1 = [120, 122, 323, 243, 765, 435, 726];

average(scores);
average(scores1);