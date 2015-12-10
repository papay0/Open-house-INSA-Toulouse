<div id="content">

</div>

<script type="text/babel">
import DateTimeField from "react-bootstrap-datetimepicker";
const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;
var Jumbotron = ReactBootstrap.Jumbotron;


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
   //<DisplayContainer2/>,
    <Create/>,
    document.getElementById('content')
  );

</script>
