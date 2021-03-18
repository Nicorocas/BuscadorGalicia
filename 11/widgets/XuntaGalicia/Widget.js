define(['dojo/_base/declare', 'jimu/BaseWidget', "dojo/_base/lang", "esri/tasks/QueryTask", "esri/tasks/query", "esri/graphic", "esri/Color", "esri/symbols/SimpleLineSymbol", "esri/SpatialReference"], function (declare, BaseWidget, lang, QueryTask, Query, Graphic, Color, SimpleLineSymbol, SpatialReference) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

    // Custom widget code goes here

    baseClass: 'xunta-galicia',
    // this property is set by the framework when widget is loaded.
    // name: 'XuntaGalicia',
    // add additional properties here

    //methods to communication with app container:
    postCreate: function postCreate() {
      this.inherited(arguments);
    },

    startup: function startup() {
      this.inherited(arguments);
    },

    onOpen: function onOpen() {},
    cargaConcellos: function cargaConcellos() {

      var codigoProvincia = this.selectProvincia.value;
      if (codigoProvincia == -1) return;
      this.selectConcellos.innerHTML = "";
      var queryTask = new QueryTask(this.config.serviceUrl);

      var query = new Query();
      // query.returnGeometry== fasle;
      query.outFields = ["CODCONC", "CONCELLO"]; //se utiliza para solo visualizar los campos necesarios
      query.orderByFields = ["CONCELLO"]; // se utiliza para ordenar por nombres
      query.where = "CODPROV = " + codigoProvincia; // aqui buscamos que el where de la query sea a partir del codigo de la provincia asi solo mostrara los resultados que queremos

      queryTask.execute(query, lang.hitch(this, function (results) {
        // primero la opcion por defecto -1
        var opt = document.createElement("option");
        opt.value = -1;
        opt.text = "Seleccione concello";
        this.selectConcellos.add(opt);
        // ahora una opcion para cada opcion
        for (var i = 0; i < results.features.length; i++) {
          opt = document.createElement("option");
          opt.value = results.features[i].attributes.CODCONC;
          opt.text = results.features[i].attributes.CONCELLO;
          this.selectConcellos.add(opt);
        }
      }));
    },

    cargaParroquias: function cargaParroquias() {

      var codigoCONCELLO = this.selectConcellos.value;
      if (codigoCONCELLO == -1) return;
      this.selectParroquias.innerHTML = "";

      var queryTask = new QueryTask(this.config.Parroquia);

      var query = new Query();
      // query.returnGeometry== fasle;
      query.outFields = ["CODCONC", "CONCELLO", "PARROQUIA", "CODPARRO"]; //se utiliza para solo visualizar los campos necesarios
      query.orderByFields = ["CONCELLO"]; // se utiliza para ordenar por nombres
      query.where = "CODCONC = " + codigoCONCELLO; // aqui buscamos que el where de la query sea a partir del codigo de la provincia asi solo mostrara los resultados que queremos

      queryTask.execute(query, lang.hitch(this, function (results) {
        // primero la opcion por defecto -1
        var opt = document.createElement("option");
        opt.value = -1;
        opt.text = "Seleccione parroquia";
        this.selectParroquias.add(opt);
        // ahora una opcion para cada opcion
        for (var i = 0; i < results.features.length; i++) {
          opt = document.createElement("option");
          opt.value = results.features[i].attributes.CODPARRO;
          opt.text = results.features[i].attributes.PARROQUIA;
          this.selectParroquias.add(opt);
        }
      }));
    },

    zoomConcello: function zoomConcello() {

      var ZOOMCONCELLO = this.selectConcellos.value;
      if (ZOOMCONCELLO == -1) return;

      /// AHORA LA QUERY PARA QUE NOS DE LA GEOMETRIA
      var queryTask = new QueryTask(this.config.serviceUrl);

      var query = new Query();
      query.returnGeometry = true;
      query.outSpatialReference = new SpatialReference(102100);
      query.where = "CODCONC = " + ZOOMCONCELLO;

      queryTask.execute(query, lang.hitch(this, function (results) {
        if (results.features.length > 0) {
          var geom = results.features[0].geometry;
          this.map.graphics.clear();
          this.map.graphics.add(new Graphic(geom, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 1)));
          this.map.setExtent(geom.getExtent(), true);
        }
      }));
    },
    zoomParroquia: function zoomParroquia() {

      var ZOOMPARROQUIA = this.selectParroquias.value;
      if (ZOOMPARROQUIA == -1) return;

      /// AHORA LA QUERY PARA QUE NOS DE LA GEOMETRIA
      var queryTask = new QueryTask(this.config.Parroquia);

      var query = new Query();
      query.returnGeometry = true;
      query.outSpatialReference = new SpatialReference(102100);
      query.where = "CODPARRO = " + ZOOMPARROQUIA;

      queryTask.execute(query, lang.hitch(this, function (results) {
        if (results.features.length > 0) {
          var geom = results.features[0].geometry;
          this.map.graphics.clear();
          this.map.graphics.add(new Graphic(geom, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 2)));
          this.map.setExtent(geom.getExtent(), true);
        }
      }));
    }

    //////////////////////////

  });
});
//# sourceMappingURL=Widget.js.map
