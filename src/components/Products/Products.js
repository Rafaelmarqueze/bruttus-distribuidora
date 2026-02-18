import { ProductsSection, ProductsGrid, ProductCard } from './styles'

export default function Products() {
  return (
    <ProductsSection id="produtos">
      <div className="container">
        <h2>A BASE PERFEITA PARA O SEU HAMBÚRGUER</h2>
        <p>Cada hamburgueria tem seu estilo. Por isso, oferecemos soluções que se adaptam à sua operação.</p>
        
        <ProductsGrid>
          <ProductCard>
            <h3>HAMBÚRGUERES MOLDADOS</h3>
            <p>A escolha ideal para quem busca agilidade e padronização. Com peso e formato uniformes, garantem preparo rápido e consistente.</p>
          </ProductCard>

          <ProductCard>
            <h3>BLENDS RESFRIADOS</h3>
            <p>Para mestres hamburgueiros que amam controle total. Embalados a vácuo em pacotes de 3kg, preservam frescor, cor e sabor original.</p>
          </ProductCard>
        </ProductsGrid>
      </div>
    </ProductsSection>
  )
}