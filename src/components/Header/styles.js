import styled from 'styled-components'

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.reddark};;
  color: ${({ theme }) => theme.colors.white};
  z-index: 1000;
  padding: 1rem 0;
`

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Logo = styled.a`
display: flex;
  align-items: center;
  height: 70px; 
`

export const NavLinks = styled.ul`
  display: flex;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.reddark};
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 1.5rem;
    transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-150%)'};
    transition: transform 0.3s ease;
  }

  li a {
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
    
  }
    li:last-child a {
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.dark};
    border-radius: 20px;
    padding: 0.5rem 1.5rem;
    
    /* Remove qualquer efeito de hover */
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  
`

export const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 6px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
  }

  span {
    width: 30px;
    height: 3px;
    background: ${({ theme }) => theme.colors.white};
    transition: all 0.3s ease;
  }
`