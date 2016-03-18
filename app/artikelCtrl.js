app.controller('artikelCtrl', function ($scope, $modal, $filter, Data) {
    $scope.artikels = {};
    Data.get('artikel').then(function(data){
        $scope.artikel = data.data;
    });
    $scope.deleteArtikel = function(artikels){
        if(confirm("Weet u zeker dat u de artikel wilt verwijderen?")){
            Data.delete("artikel/"+artikels.id).then(function(result){
                $scope.artikels = _.without($scope.artikels, _.findWhere($scope.artikel, {id:artikels.id}));
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
                p.id = selectedObject.id;
                p.naam = selectedObject.naam;
                p.beschikbaarheid = selectedObject.beschikbaarheid;
            }
        });
    };
    
 $scope.columns = [
                    {text:"Naam",predicate:"Naam",sortable:true,},
                    {text:"Beschikbaarheid",predicate:"Beschikbaarheid",sortable:true},
                ];

});


app.controller('artikelEditCtrl', function ($scope, $modalInstance, item, Data) {

  $scope.artikels = angular.copy(item);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Afsluiten');
        };
        $scope.title = (item.id > 0) ? 'Bewerk artikel' : 'Voeg artikel toe';
        $scope.buttonText = (item.id > 0) ? 'Sla bewerking op' : 'Voeg nieuwe artikel toe';

        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.artikels);
        }
        $scope.saveArtikel = function (artikels) {
            artikels.uid = $scope.uid;
            if(artikels.id > 0){
                Data.put('artikel/'+artikels.id, artikels).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(artikels);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{
                Data.post('artikel', artikels).then(function (result) {

                    if(result.status != 'error'){
                        var x = angular.copy(artikels);
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
