$(document).ready(function (){
   $('.ui-btnsolid').click(function (){
           $(this).toggleClass('ui-btnsolid').toggleClass('ui-btntranspo');
		   
   });
   
      $('.ui-btntranspo').click(function (){
             $(this).toggleClass('ui-btntranspo').toggleClass('ui-btnsolid');
   });
});