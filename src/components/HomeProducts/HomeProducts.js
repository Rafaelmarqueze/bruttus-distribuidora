"use client";
import { ProductsSection, ProductsGrid, ProductCard } from './styles';

export default function HomeProducts() {
  return (
    <ProductsSection id="produtos">
      <div className="container">
        <h2>
          A BASE <span>PERFEITA</span> PARA O SEU HAMBÚRGUER
        </h2>

        <p>
          Cada hamburgueria tem seu estilo. Por isso, oferecemos soluções que se
          adaptam à sua operação, garantindo sempre o máximo de qualidade e
          padronização.
        </p>

        <ProductsGrid>
          <ProductCard>
            <p><span>A CARNE</span></p>
            <div className="image molded" />
            <p><span>DAS MELHORES</span></p>
            <div className="image molded2" />
            <div className="content">
              <h3>HAMBÚRGUERES MOLDADOS</h3>
              <p>
                A escolha ideal para quem busca agilidade e padronização. Com peso
                e formato uniformes, garantem preparo rápido e consistente,
                preservando textura e sabor artesanal.
              </p>
            </div>
          </ProductCard>

          <ProductCard>
            <div className="image blends" />
            <div className="content">
              <h3>BLENDS RESFRIADOS</h3>
              <p>
                Para mestres hamburgueiros que amam controle total. Embalados a
                vácuo em pacotes de 3kg, preservam frescor, cor e sabor original.
              </p>
            </div>
          </ProductCard>
        </ProductsGrid>
      </div>
    </ProductsSection>
  );
}