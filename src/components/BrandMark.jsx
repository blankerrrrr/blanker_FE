import styled from 'styled-components'

const StyledMark = styled.svg`
  display: block;
  filter: ${({ $blurred }) => ($blurred ? 'blur(20px)' : 'none')};
`

function BrandMark({ blurred = false, className = '', ...props }) {
  return (
    <StyledMark
      $blurred={blurred}
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 402 874"
      {...props}
    >
      <path
        d="M0 410 335 245v409L0 819v-87l258-127V369L0 496Z"
        fill="#303030"
      />
      <path
        d="M66 216 402 50v87L143 265v238l259-129v87L66 627Z"
        fill="#000"
      />
    </StyledMark>
  )
}

export default BrandMark
