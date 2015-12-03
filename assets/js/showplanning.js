$(function () {
  <% _.each(presentations, function (presentation) { %>
    var start = moment(Date.parse("<%= presentation.get('start') %>")).format('DD/MM/YYYY HH:mm');
    $("#start<%= presentation.id %>").text(start);
    var end = moment(Date.parse("<%= presentation.get('end') %>")).format('DD/MM/YYYY HH:mm');
    $("#end<%= presentation.id %>").text(end);      
  <% })%>

  $('.suscribeButton').click(function(){
    var divAffichage = $(this);
    if (divAffichage.text() == "Supprimer de mon planning"){
      remove(divAffichage);
    }else{
      restore(divAffichage);
    }
  });

  function remove(divAffichage){
    divAffichage.text("Suppression");
    divAffichage.attr("class", "btn btn-info");
    $.ajax({
       url : '/removePresentation',
       type : 'POST',
       data : 'presentationId=' + $(this).attr('id'),
       dataType : 'html',
       success : function(code_html, statut){
          divAffichage.text("Restaurer dans le planning !");
          divAffichage.attr("class", "btn btn-success cancelRemove");
       },
       error : function(resultat, statut, erreur){
         divAffichage.text("Erreur " + erreur);
         divAffichage.attr("class", "btn btn-danger");
       },
    });
  }

  function restore(divAffichage){
    divAffichage.text("Rajout");
    divAffichage.attr("class", "btn btn-info");
    $.ajax({
       url : '/suscribePresentation',
       type : 'POST',
       data : 'presentationId=' + $(this).attr('id'),
       dataType : 'html',
       success : function(code_html, statut){
          divAffichage.text("Remis dans le planning !");
          divAffichage.attr("class", "btn btn-success suscribeButton");
       },
       error : function(resultat, statut, erreur){
         divAffichage.text("Erreur " + erreur);
         divAffichage.attr("class", "btn btn-danger");
       },
    });
  }

});