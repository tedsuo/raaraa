$(function(){
  raa.init();
});

raa = {
  col_count: 3,
  
  init: function(){
    $('#show-photos').click(raa.display('photos',1));
    $('#show-shouts').click(raa.display('shouts',2));
    $('#show-friends').click(raa.display('friends',3));
  },
  
  display: function(type,col_num){
    return function(){
      if($(this).attr('checked')){
        raa.show(type,col_num);
      } else {
        raa.hide(col_num);
      }
    }
  },
  
  show: function(type,col_num){
//    ++raa.col_count;
    $('#col-'+col_num).load('/templates/'+type+'-'+raa.col_count+'.html',function(){
      $('.content','#col-'+col_num).show('slide',500);
    });
  },
  
  hide: function(col_num){
//    --raa.col_count;  
    $('.content','#col-'+col_num).hide('fade',200);
  }
};