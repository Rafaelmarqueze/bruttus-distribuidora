"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 22px;
  border-bottom: 2px solid #ff6b35;
  padding-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;

  th {
    background: #f5f5f5;
    padding: 12px;
    text-align: left;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    color: #333;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  tr:hover {
    background: #f9f9f9;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  &:hover {
    background: #e55a1f;
  }
`;

const SmallButton = styled.button`
  padding: 6px 10px;
  background: #6b4f3f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 12px;
  margin-right: 8px;
  &:hover {
    background: #584235;
  }
`;

const ImagePreviewContainer = styled.div`
  margin-top: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 150px;
  border-radius: 4px;
`;

const FileInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 20px;
`;

const ModalText = styled.p`
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  background: ${(props) => (props.danger ? "#dc3545" : "#ff6b35")};
  color: white;

  &:hover {
    background: ${(props) => (props.danger ? "#c82333" : "#e55a1f")};
  }
`;

const ModalButtonSecondary = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  background: white;
  color: #333;

  &:hover {
    background: #f0f0f0;
  }
`;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, title: "", message: "", type: "success", onConfirm: null });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // request presigned upload URL from server
    (async () => {
      try {
        const res = await fetch('/api/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error('Erro ao obter upload-url', err);
          showModal('Erro', 'Não foi possível obter URL de upload', 'error');
          return;
        }
        const { uploadUrl, publicUrl } = await res.json();

        // upload file directly to S3 using presigned URL
        const put = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!put.ok) {
          console.error('Upload PUT failed', put.statusText);
          showModal('Erro', 'Falha ao enviar imagem para S3', 'error');
          return;
        }

        // set preview and store public URL to save in product
        setImagePreview(publicUrl);
        setNewProduct({ ...newProduct, imageUrl: publicUrl });
      } catch (err) {
        console.error('handleImageChange error', err);
        showModal('Erro', 'Erro ao enviar imagem', 'error');
      }
    })();
  };

  const showModal = (title, message, type = "success") => {
    setModal({ show: true, title, message, type, onConfirm: null });
  };

  const closeModal = () => {
    setModal({ show: false, title: "", message: "", type: "success", onConfirm: null });
  };

  const showConfirm = (title, message, onConfirm) => {
    setModal({ show: true, title, message, type: "confirm", onConfirm });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.price === "") {
      showModal("Atenção", "Nome e preço são obrigatórios", "warning");
      return;
    }
    try {
      if (editingId) {
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name: newProduct.name,
            description: newProduct.description,
            price: parseFloat(newProduct.price),
            imageUrl: newProduct.imageUrl,
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
          setEditingId(null);
          setNewProduct({ name: "", description: "", price: "", imageUrl: "" });
          setImagePreview("");
          showModal("Sucesso", "Produto atualizado com sucesso!", "success");
        } else {
          showModal("Erro", "Erro ao atualizar produto", "error");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newProduct.name,
            description: newProduct.description,
            price: parseFloat(newProduct.price),
            imageUrl: newProduct.imageUrl,
          }),
        });
        if (res.ok) {
          const prod = await res.json();
          setProducts([...products, prod]);
          setNewProduct({ name: "", description: "", price: "", imageUrl: "" });
          setImagePreview("");
          showModal("Sucesso", "Produto criado com sucesso!", "success");
        } else {
          showModal("Erro", "Erro ao criar produto", "error");
        }
      }
    } catch (err) {
      console.error(err);
      showModal("Erro", "Erro ao criar produto", "error");
    }
  };

  const handleEditClick = (prod) => {
    setEditingId(prod.id);
    setNewProduct({ name: prod.name || "", description: prod.description || "", price: prod.price?.toString() || "", imageUrl: prod.imageUrl || "" });
    setImagePreview(prod.imageUrl || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewProduct({ name: "", description: "", price: "", imageUrl: "" });
    setImagePreview("");
  };

  const handleDelete = (id) => {
    showConfirm("Confirmar exclusão", "Deseja realmente excluir este produto?", async () => {
      try {
        const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          setProducts(products.filter((p) => p.id !== id));
          showModal("Sucesso", "Produto excluído", "success");
        } else {
          showModal("Erro", "Erro ao excluir produto", "error");
        }
      } catch (err) {
        console.error(err);
        showModal("Erro", "Erro ao excluir produto", "error");
      }
    });
  };

  return (
    <Container>
      <SectionTitle>Produtos</SectionTitle>
      <Form onSubmit={handleCreate}>
        <FormGroup>
          <Label>Nome</Label>
          <Input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Preço</Label>
          <Input
            type="number"
            step="0.01"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Imagem</Label>
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </FormGroup>
        {imagePreview && (
          <FormGroup>
            <Label>Preview</Label>
            <ImagePreviewContainer>
              <ImagePreview src={imagePreview} alt="Preview do produto" />
            </ImagePreviewContainer>
          </FormGroup>
        )}
        <FormGroup style={{ gridColumn: '1 / -1' }}>
          <Label>Descrição</Label>
          <Textarea
            rows="3"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
        </FormGroup>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
          <Button type="submit">{editingId ? 'Salvar Alterações' : 'Adicionar Produto'}</Button>
          {editingId && (
            <ModalButtonSecondary type="button" onClick={handleCancelEdit}>Cancelar</ModalButtonSecondary>
          )}
        </div>
      </Form>

      {loading ? (
        <p>Carregando...</p>
      ) : products.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>R$ {Number(p.price).toFixed(2)}</td>
                <td>{p.description || "-"}</td>
                <td>
                  <SmallButton onClick={() => handleEditClick(p)}>Editar</SmallButton>
                  <ModalButton danger onClick={() => handleDelete(p.id)}>Excluir</ModalButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {modal.show && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{modal.title}</ModalTitle>
            <ModalText>{modal.message}</ModalText>
            <ModalButtonGroup>
              {modal.type === "success" && (
                <ModalButton onClick={closeModal}>OK</ModalButton>
              )}
              {modal.type === "error" && (
                <ModalButton danger onClick={closeModal}>OK</ModalButton>
              )}
              {modal.type === "warning" && (
                <ModalButton onClick={closeModal}>Entendi</ModalButton>
              )}
                {modal.type === "confirm" && (
                  <>
                    <ModalButton danger onClick={() => { if (typeof modal.onConfirm === 'function') modal.onConfirm(); closeModal(); }}>Confirmar</ModalButton>
                    <ModalButtonSecondary onClick={closeModal}>Cancelar</ModalButtonSecondary>
                  </>
                )}
            </ModalButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}