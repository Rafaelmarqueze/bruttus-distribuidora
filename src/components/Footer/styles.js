import styled from "styled-components"

export const FooterContainer = styled.footer`
  background-color: #520109;
  color: ${({ theme }) => theme.colors.white};

  padding: ${({ theme }) => theme.spacing.xl} 0
    ${({ theme }) => theme.spacing.md};
`

export const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: ${({ theme }) => theme.spacing.lg};

  img {
    object-fit: contain;
  }
`

export const Copyright = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.15);

  opacity: 0.7;
  font-size: 0.875rem;
`
