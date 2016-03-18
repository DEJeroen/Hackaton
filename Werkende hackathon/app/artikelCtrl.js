app.controller('artikelCtrl', function ($scope, $modal, $filter, Data) {
    $scope.artikel = {};
    Data.get('artikel').then(function(data){
        $scope.artikel = data.data;
    });
    $scope.deleteartikel = function(artikel){
        if(confirm("Weet u zeker dat u de artikel wilt verwijderen?")){
            Data.delete("artikel/"+artikel.artikel_id).then(function(result){
                $scope.artikel = _.without($scope.artikel, _.findWhere($scope.artikel, {id:artikel.artikel_id}));
            });
        }
    };
    $scope.open = function (p,size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/artikelEdit.html',
          controller: 'artikelEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
              console.log(p);
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.artikel.push(selectedObject);
                $scope.artikel = $filter('orderBy')($scope.artikel, 'id', 'reverse');
            }else if(selectedObject.save == "update"){
                p.artikelnummer = selectedObject.artikelnummer;
                p.achternaam = selectedObject.achternaam;
                p.voornaam = selectedObject.voornaam;
                p.tel = selectedObject.tel;;
                p.comments = selectedObject.comments;
            }
        });
    };
    
 $scope.columns = [
                    {text:"Naam",predicate:"Naam",sortable:true,},
                    {text:"Beschikbaarheid",predicate:"Beschikbaarheid",sortable:true},
                ];

});


app.controller('artikelEditCtrl', function ($scope, $modalInstance, item, Data) {

  $scope.artikel = angular.copy(item);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Afsluiten');
        };
        $scope.title = (item.id > 0) ? 'Bewerk artikel' : 'Voeg artikel toe';
        $scope.buttonText = (item.id > 0) ? 'Sla bewerking op' : 'Voeg nieuwe artikel toe';

        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.artikel);
        }
        $scope.saveArtikel = function (artikel) {
            artikel.uid = $scope.uid;
            if(artikel.id > 0){
                Data.put('artikel/'+artikel.artikel_id, artikel).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(artikel);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{
                Data.post('artikel', artikel).then(function (result) {

                    if(result.status != 'error'){
                        var x = angular.copy(artikel);
                        x.save = 'insert';
                        x.id = result.data;
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }
        };
});
