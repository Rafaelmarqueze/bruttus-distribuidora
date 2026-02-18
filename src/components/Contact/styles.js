import styled from 'styled-components'

export const ContactSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: ${({ theme }) => theme.colors.black};
      color: white;

  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-align: center;
        color: white;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 2rem;
    }
  }

  > p {
    text-align: center;
    font-size: 1.125rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    color: white;
  }
`

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.white};
  }

  h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.white};
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .contact-info {
    margin-bottom: ${({ theme }) => theme.spacing.md};

    p {
      font-size: 1.125rem;
      font-weight: 500;
    }
  }
`

export const Form = styled.form`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  button {
    width: 100%;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.dark};
    font-weight: 700;
    padding: 1rem;
    border-radius: 4px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
      color: ${({ theme }) => theme.colors.white};
    }
  }
`

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.gray};
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &::placeholder {
      color: #999;
    }
  }
`

export const SocialLinks = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};

  ul {
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      flex-wrap: wrap;
    }

    li a {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: ${({ theme }) => theme.colors.dark};
      color: ${({ theme }) => theme.colors.white};
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.dark};
      }
    }
  }
`