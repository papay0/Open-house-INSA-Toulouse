/*
    browserify -t reactify assets/React/edit.js -o assets/React/editBrowserified.js
*/

var Table = ReactBootstrap.Table;
var Button = ReactBootstrap.Button;
var Image = ReactBootstrap.Image;
var Alert = ReactBootstrap.Alert;
var Modal = ReactBootstrap.Modal;
var Input = ReactBootstrap.Input;
var Grid = ReactBootstrap.Grid;
var Text = ReactBootstrap.Text;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Glyphicon = ReactBootstrap.Glyphicon;
var DropdownButton = ReactBootstrap.DropdownButton;
var DateTimeField = ReactBootstrap.DateTimeField;
var Dropzone = require('react-dropzone');
var FileInput = require('react-file-input');
var request = require('superagent');
//var DropzoneComponent = require('react-dropzone-component');
// var IntlMixin     = ReactIntl.IntlMixin;
// var FormattedDate = ReactIntl.FormattedDate;

const AlertAutoDismissable = React.createClass({
  getInitialState() {
    return {
      alertVisible: true
    };
  },

  render() {
    if (this.state.alertVisible) {
      return (
        <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss} dismissAfter={2000}>
          <h4>Oh snap! You got an error!</h4>
          <p>But this will hide after 2 seconds.</p>
        </Alert>
      );
    }

    return (
      <Button onClick={this.handleAlertShow}>Show Alert</Button>
    );
  },

  handleAlertDismiss() {
    this.setState({alertVisible: false});
  },

  handleAlertShow() {
    this.setState({alertVisible: true});
  }
});

var DropzoneDemo = React.createClass({
    onDrop: function (files) {
      console.log('Received files: ', files);
    },

    render: function () {
      return (
          <div>
            <Dropzone onDrop={this.onDrop}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
      );
    }
});


var Dropzone2 = React.createClass({
      getInitialState: function() {
        return {
          isDragActive: false
        }
      },

      propTypes: {
        onDrop: React.PropTypes.func.isRequired,
        size: React.PropTypes.number,
        style: React.PropTypes.object
      },

      onDragLeave: function(e) {
        this.setState({
          isDragActive: false
        });
      },

      onDragOver: function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        this.setState({
          isDragActive: true
        });
      },



      onClick: function () {
        this.refs.fileInput.getDOMNode().click();
      },

      _createPreview: function(file){
        var self = this
          , newFile
          , reader = new FileReader();

        reader.onloadend = function(e){
          newFile = {file:file, imageUrl:e.target.result};
          if (self.props.onDrop) {
            self.props.onDrop(newFile);
          }
        };

        reader.readAsDataURL(file);
      },

      render: function() {

        var className = 'dropzone';
        if (this.state.isDragActive) {
          className += ' active';
        };

        var style = {
          width: this.props.size || 100,
          height: this.props.size || 100,
          borderStyle: this.state.isDragActive ? 'solid' : 'dashed'
        };

        return (
          <div className={className}  onClick={this.onClick} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onDrop}>
            <input style={{display: 'none' }} type='file' multiple ref='fileInput' onChange={this.onDrop} />
            {this.props.children}
          </div>
        );
      }

    });


const EditModal = React.createClass({
  getInitialState() {
    return {
      show: false,
      name: this.props.name,
      start: this.props.start,
      end: this.props.end,
      id: this.props.id,
      styleButton : "primary",
      alertVisible: false,
      messageError: "",
      files: [this.props.image],
      imageEdited: false
    };
  },
  save: function(){
    var file = this.state.files[0];

    var fd = new FormData();
    fd.append('name', this.state.name);
    fd.append('start', this.state.start);
    fd.append('end', this.state.end);
    fd.append('id', this.state.id);
    fd.append('imageEdited', this.state.imageEdited);
    fd.append('image', file);
    alert('image edited ?'+this.state.imageEdited);
    //console.log('FormData: '+JSON.stringify(fd));
    var data2 = {
      file: file
    }
    var data = {
      name: this.state.name,
      start: this.state.start,
      end: this.state.end,
      id: this.state.id
    };

    $.ajax({
      url: '/presentations/edit',
      type: 'POST',
      data: fd,
      dataType: 'json',
      cache: false,
      processData: false,
      contentType: false,
      success: function(data) {
        this.setState({ show: false});
        this.changeStyleButton("success");
      }.bind(this),
      error: function(res, status, err) {
        //alert("Something went wrong when you tried to edit a presentation");
        this.changeStyleButton("danger");
        this.setState({messageError: "Something went wrong: res: "+res+" status "+status+" error "+err})
        this.setState({alertVisible: true});
        // this.setState({ show: false});
      }.bind(this)
    });
  },
  handleNameChange: function(event) {
    this.setState({ name: event.target.value });
  },
  handleStartChange: function(event) {
    this.setState({ start: event.target.value });
  },
  handleEndChange: function(event) {
    this.setState({ end: event.target.value });
  },
  handleAlertDismiss() {
    this.setState({alertVisible: false});
  },

  handleAlertShow() {
    this.setState({alertVisible: true});
  },
  handleClose() {
    this.setState({ show: false})
  },
  handleOpenModal() {
    this.setState({ show: true})
  },
  changeStyleButton: function(state){
    var that = this;
    this.setState({ styleButton: state});
    setTimeout(function(){
      that.setState({ styleButton: "primary"});
    }, 2000);
  },
  _handleImageChange(e) {
    this.refs.fileInput.getDOMNode().click();
  },
  onDrop2: function (files) {
    console.log('Received files: ', files);
  },
  onDrop: function (files) {
    console.log('Received files: ', files);
    console.log('Received file: ', files[0]);
    this.setState({
      imageEdited: true
    });
      this.setState({
        files: files
      });
      console.log('ImageEdited: '+this.state.imageEdited);
    },
    onOpenClick: function () {
      this.refs.dropzone.open();
      console.log('ImageEdited onOpenClick: '+this.state.imageEdited);
    },
  handleChangeImage: function(event) {
   console.log('Selected file:', event.target.files[0]);
 },
  render() {
    var name = this.state.name;
    var start = this.state.start;
    var end = this.state.end;

    var alert = (
          <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss} >
            <h4>{this.state.messageError}</h4>
          </Alert>
    );

    var djsConfig = {
        addRemoveLinks: true,
        params: {
            myParam: 'Hello from a parameter!',
            anotherParam: 43
        }
    };

    var componentConfig = {
        showFiletypeIcon: false,
        postUrl: '/uploadHandler'
    };

    if (!this.state.alertVisible){
      alert = null;
    }
    var ImageStyle = {
      justifyContent: 'center',
    alignItems: 'center'
    };
    var divStyle = {
      width: "100%",
      height: 40
    };
    var DropZoneStyle = {
      width: 0,
      height: 0,
    };

    return (
      <div className="modal-container">
        <Button
          bsStyle={this.state.styleButton}
          bsSize="xsmall"
          onClick={this.handleOpenModal}
        >
          Edit
        </Button>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Edit Presentation</Modal.Title>
          </Modal.Header>
          {alert}
          <Modal.Body>
          <form className="form-horizontal">
              <Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" value={name} onChange={this.handleNameChange}/>
              <Input type="text" label="Start" labelClassName="col-xs-2" wrapperClassName="col-xs-10" value={start} onChange={this.handleStartChange}/>
              <Input type="text" label="End" labelClassName="col-xs-2" wrapperClassName="col-xs-10" value={end} onChange={this.handleEndChange}/>
              <div>
                <Dropzone ref="dropzone" style={DropZoneStyle} onDrop={this.onDrop} multiple={false} disableClick={false}>
                </Dropzone>
                <Button bsStyle="primary" style={divStyle} onClick={this.onOpenClick}>
                    Click to edit image
                </Button>
                {this.state.files.length > 0 ? <div>
                <h4>Preview:</h4>
                <div>{this.state.files.map(function (file) {
                  return (
                    <Image src={file.preview != null ? file.preview : file.url}rounded responsive />
                  );
                })} </div>
                </div> : null}
            </div>
          </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.save} bsStyle="success">Save</Button>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});



var Presentations = React.createClass({
  loadPresentationsFromServer: function(){
    $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({presentations_parse: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
  },
  getInitialState: function() {
    return {
      presentations_parse: []
    };
  },
  componentDidMount: function() {
    this.loadPresentationsFromServer();
    setInterval(this.loadPresentationsFromServer, this.props.pollInterval);
  },
  render: function(){
    var presentations = this.state.presentations_parse.map(function(presentation, index) {
      var start = moment(presentation.start.iso).zone(0).format('MM/DD/YYYY HH:mm');
      var end = moment(presentation.end.iso).zone(0).format('MM/DD/YYYY HH:mm');
      var name = presentation.name;
      var image = presentation.image;
      var id = presentation.objectId;
      return (
        <tr key={id}>
          <td >{index+1}</td>
          <td >{name}</td>
          <td >{start}</td>
          <td >{end}</td>
          <td ><EditModal id={id} name={name} start={start} end={end} image={image}/></td>
        </tr>
      );
    }, this);
    var thEditStyle = {
      width: 40
    };
    const tableInstance = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th style={thEditStyle}>Edit</th>
          </tr>
          </thead>
          <tbody>
              {presentations}
          </tbody>
      </Table>
    );
    return (
      tableInstance
    );
  }
});

var DisplayContainer2 = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState:function(){
        return{
            value:'My Value',
            value2:'My Value2'
        }
    },
    render:function(){
        return (
            <div className="DisplayContainer">
                <h4>{this.state.value}</h4>
                <h4>{this.state.value2}</h4>
                <InputBox2 valueLink={this.linkState('value')}  valueLink={this.linkState('value2')} />
            </div>
        );
    }
});

var InputBox2 = React.createClass({
    render:function(){
        return (
          <div>
          <input type="text" valueLink={this.props.valueLink} />
          <input type="text" valueLink={this.props.valueLink} />
          </div>
      )
    }
});

ReactDOM.render(
   //<DisplayContainer2/>,
    <Presentations url="/react/presentations/" pollInterval={2000}/>,
    document.getElementById('content')
  );
