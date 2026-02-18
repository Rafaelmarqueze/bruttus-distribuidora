import styled from 'styled-components'
import logo from '../../../public/images/logo.jpg'

export const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background:
    linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)),
    url('https://i0.wp.com/foodforum.com.br/wp-content/uploads/2024/04/alimentos-plant-based.jpg?resize=672%2C448&ssl=1')
    center / cover no-repeat;
  color: ${({ theme }) => theme.colors.white};
  padding-top: 80px;
`
export const HeroContent = styled.div`
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  p {
    font-size: 1.2rem;
    margin: 2rem 0;
    opacity: 0.9;
    line-height: 1.6;
    max-width: 650px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    p {
      font-size: 1rem;
    }
  }
`;

export const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.15;

  span {
    color: #FB2C36;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.4rem;
  }
`
export const Subtitle = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  margin-bottom: 1.5rem;
  color: #FB2C36;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);

`
export const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.dark};

  font-weight: 700;
  padding: 1rem 2.5rem;
  border-radius: 999px;

  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.4);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
  }
`