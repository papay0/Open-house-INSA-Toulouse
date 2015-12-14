var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;
var Jumbotron = ReactBootstrap.Jumbotron;
// include("/js/react-bootstrap-datetimepicker/react-bootstrap-datetimepicker.js");

//var DateTimeField = require('react-datepicker');
//var DateTimeField = require('react-bootstrap-datetimepicker');

const createForm = (
  <form>
    <Input type="text" label="Text" placeholder="Enter text" />
    <Input type="file" label="File" help="[Optional] Block level help text" />

    <ButtonInput type="reset" value="Reset Button" />
    <ButtonInput type="submit" value="Submit Button" />
  </form>
);

var Create = React.createClass({
    render:function(){
        return (
          <div class="container">
            <div class="row">
              <div class="col-md-6 col-md-offset-3">
                {createForm}
              </div>
            </div>
          </div>
        )
      }
    });

ReactDOM.render(
    <Create />,
    document.getElementById('content')
  );
