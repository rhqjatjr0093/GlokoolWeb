import '../Date/react-datetime.css';
import Datetime from "react-datetime";
import styled from 'styled-components';
import moment from 'moment';

const Wrapper = styled.div`
    margin-top: 1rem;    
`;

const Label = styled.div`
    font-size: 1rem;
    color: #5F5F5F;
    margin-bottom: 0.25rem;
`;

const renderInput = ((props) => {
    function clear() {
      props.onChange({ target: { name: 'birthDate', value: '' } });
    }
    return (
      <div>
        <input {...props} style={{
            width: '50%',
            fontSize: '1.2rem',
            boxSizing: 'border-box',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            border: '1px solid #707070',
            outline: 'none',
            borderRadius: '0px',
        }}/>
      </div>
    );
  })

const Authdate = ({label, ...rest}) => (
    
    <Wrapper>
        <Label>{label}</Label>
        <Datetime {...rest} renderInput={renderInput}/>
    </Wrapper>

    
);

export default Authdate;


