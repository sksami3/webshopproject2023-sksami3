// import './App.css';
import Shop from './ShopComponent';
import AddItem from './AddItemComponent';
import MyItems from './MyItemComponent';
import { ITEMS } from '../shared/items';
import { Component } from 'react';
import ItemDetail from './ItemDetailComponent';
import Header from './HeaderComponent';
import { Routes, Route, useParams } from 'react-router-dom';

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            items: ITEMS
        };
    }

    render() {
        const ItemWithId = (match) => {
            let {itemId} = useParams();
            return (
                <ItemDetail item={this.state.items.filter((item) =>  item.id === parseInt(itemId, 10))[0]} />
            );
        }

        return (
            <div>
                <Header />
                <Routes>
                    <Route exact path="/shop" element={<Shop items={this.state.items} />} />
                    <Route path="/item/:itemId" element={<ItemWithId />} />
                    <Route path="/addItem" element={<AddItem />} />
                    <Route path="/myitems" element={<MyItems items={this.state.items.filter((item) => item.createdBy === parseInt(122, 10))} />} />
                    <Route path="/" element={<Shop items={this.state.items} />} />
                </Routes>
            </div>
        );
    }
}

export default Main;
