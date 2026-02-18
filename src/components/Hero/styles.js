import styled from 'styled-components'
import logo from '../../public/images/logo.jpg'

export const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), 
              url('https://i0.wp.com/foodforum.com.br/wp-content/uploads/2024/04/alimentos-plant-based.jpg?resize=672%2C448&ssl=1') center/cover;
  color: ${({ theme }) => theme.colors.white};
  padding-top: 80px;
`

export const HeroContent = styled.div`
  max-width: 800px;

  p {
    font-size: 1.25rem;
    margin: 2rem 0;
    opacity: 0.9;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 1rem;
    }
  }
`

export const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const Subtitle = styled.span`
  display: inline-block;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`

export const CTAButton = styled.a`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 700;
  padding: 1rem 2.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-2px);
  }
`