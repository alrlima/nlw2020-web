import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import axios from "axios";
import api from "../../services/api";
import Dropzone from "../../components/Dropzone";

import "./styles.css";

import logo from "../../assets/logo.svg";

interface Item {
  item_id: number;
  titulo: string;
  imagem_url: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [uf, setUF] = useState<string[]>([]);
  const [cidade, setCidade] = useState<string[]>([]);
  const [selectedUF, setSelectedtUF] = useState("0");
  const [selectedCidade, setSelectedtCidade] = useState("0");
  const [selectedPoint, setSelectedPoint] = useState<[number, number]>([0, 0]);
  const [myLocation, setMyLocation] = useState<[number, number]>([0, 0]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const [formData, setFormData] = useState({
      nome: '',
      email: '',
      telefone: '',
  });

  const history = useHistory();

  useEffect(() => {
    api.get("items").then((response) => setItems(response.data));
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )
      .then((response) => {
        const uf = response.data.map((item: any) => item.sigla);
        setUF(uf);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios?orderBy=nome`
      )
      .then((response) => {
        const cidade = response.data.map((item: any) => item.nome);
        setCidade(cidade);
      });
  }, [selectedUF]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLocation([position.coords.latitude, position.coords.longitude])
    }
    );
  }, []);

  function onSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedtUF(event.target.value);
  }

  function onSelectCidade(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedtCidade(event.target.value);
  }

  function onMapClick(event: LeafletMouseEvent) {
    setSelectedPoint([event.latlng.lat, event.latlng.lng]);
  }

  function inputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } =  event.target;
    setFormData({ ...formData, [name]: value});
  }

  function onSlectItem(id: number) {
    const selected = selectedItems.findIndex(item => item === id);
    if (selected >= 0) {
        const itemsFilter = selectedItems.filter(item =>  item !== id);
        setSelectedItems(itemsFilter);
        return;
    }
    
    setSelectedItems([ ...selectedItems, id]);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    
    const imagem = selectedFile;
    const { nome, email, telefone } = formData;
    const uf = selectedUF;
    const cidade = selectedCidade;
    const [latitude, longitude] = selectedPoint;
    const items = selectedItems;

    const data = new FormData();
    data.append('imagem', imagem ? imagem: '');
    data.append('nome', nome);
    data.append('email', email);
    data.append('telefone', telefone);
    data.append('uf', uf);
    data.append('cidade', cidade);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    await api.post('points', data);
    alert('Ponto de coleta criado!');

    history.push('/');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="eColeta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form onSubmit={submit}>
        <h1>
          Cadastro do
          <br />
          Ponto de Coleta
        </h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="nome">Nome da Entidade</label>
            <input type="text" name="nome" id="nome" onChange={inputChange} />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" onChange={inputChange} />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="telefone" id="telefone" onChange={inputChange} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={myLocation} zoom={15} onClick={onMapClick}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            />

            <Marker position={selectedPoint}></Marker>
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select
                name="uf"
                id="uf"
                value={selectedUF}
                onChange={onSelectUF}
              >
                <option value="0" key="0">
                  Selecione uma UF
                </option>
                {uf.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="cidade">Cidade</label>
              <select
                name="cidade"
                id="cidade"
                value={selectedCidade}
                onChange={onSelectCidade}
              >
                <option value="0" key="0">
                  Selecione uma Cidade
                </option>
                {cidade.map((item: any) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li className={selectedItems.includes(item.item_id) ? 'selected' : ''} key={item.item_id} onClick={() => onSlectItem(item.item_id)}>
                <img src={item.imagem_url} alt={item.titulo} />
                <span>{item.titulo}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar Ponto de Coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
