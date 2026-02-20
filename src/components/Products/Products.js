"use client";
import { useState, useEffect } from 'react';
import { ProductsSection, ProductsGrid, ProductCard } from './styles';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Erro ao carregar produtos homepage:', e);
        setProducts([]);
      }
    };
    load();
  }, []);

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
          {products.map((prod) => (
            <ProductCard key={prod.id}>
              {prod.imageUrl && <div className="image" style={{backgroundImage: `url(${prod.imageUrl})`}} />}
              <div className="content">
                <h3>{prod.name}</h3>
                <p>{prod.description}</p>
              </div>
            </ProductCard>
          ))}
        </ProductsGrid>
      </div>
    </ProductsSection>
  );
}
