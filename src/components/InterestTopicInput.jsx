import styled from "styled-components";

const Form = styled.form`
  display: flex;
  width: 100%;
  height: 53px;
  align-items: stretch;
  overflow: hidden;
  border: 1px solid #d8d8d8;
  border-radius: 26.5px;
  background: #f8f8f8;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;

  &:focus-within {
    border-color: #aaa;
    box-shadow: 0 0 0 3px rgb(0 0 0 / 6%);
  }
`;

const TopicInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 100%;
  flex: 1 1 auto;
  padding: 0 20px;
  border: 0;
  outline: 0;
  color: #333;
  background: transparent;
  font-size: 14px;

  &::placeholder {
    color: #888;
    opacity: 1;
  }
`;

const AddButton = styled.button`
  display: flex;
  width: 53px;
  height: 100%;
  flex: 0 0 53px;
  align-items: center;
  justify-content: center;
  padding-bottom: 5px;
  border: 0;
  border-left: 1px solid #d8d8d8;
  color: #949494;
  background: #f8f8f8;
  font-size: 30px;
  font-weight: 200;
  line-height: 1;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

function InterestTopicInput({
  buttonLabel,
  className = "",
  disabled = false,
  inputLabel,
  onChange,
  onSubmit,
  placeholder,
  value,
}) {
  return (
    <Form className={className} onSubmit={onSubmit}>
      <TopicInput
        aria-label={inputLabel}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
      <AddButton aria-label={buttonLabel} disabled={disabled} type="submit">
        +
      </AddButton>
    </Form>
  );
}

export default InterestTopicInput;
