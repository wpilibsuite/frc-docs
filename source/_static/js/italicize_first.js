$(document).ready(function () {
    // get all body content as a string
   var str = document.body.innerHTML;

   // find all magic words and wrap them in a <em> tag
   var result = str.replace(/(FIRST)/g, "<em>$1</em>");

   // set all body content HTML with new processed content
   document.body.innerHTML = result;
});
