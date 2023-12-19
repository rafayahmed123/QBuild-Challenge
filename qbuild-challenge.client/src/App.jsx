import { useEffect, useState } from 'react';
import MyTreeView from './MyTreeView'
import MyTable from './MyTable'

function App() {
    const outerContainerStyle = {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        padding: 10,
        border: '2px solid #000000',
    };
    const innerContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10 
    };
    const buttonStyle = {
        maxHeight: '35px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };
    const [bom, setBom] = useState({});
    const [isBomLoaded, setIsBomLoaded] = useState(false);
    const [columns, setColumns] = useState([]);
    const [currentPart, setCurrentPart] = useState('');
    const [parentPart, setParentPart] = useState('');

    // Fetch BOM data
    const loadBOM = async () => {
        await fetch(`https://localhost:7151/api/QBuild/GetBom`).then(response => response.json()).then(data => {
            setBom(data);
            setIsBomLoaded(true);
        });
    }

    // Retrieve all data in parts table for children of node
    const formatGridView = async (children) => {
        let formattedChildren = [];

        await Promise.all(children.map(async (childNode) => {
            const response = await fetch(`https://localhost:7151/api/QBuild/GetParts?componentName=${childNode.COMPONENT_NAME}`);
            const data = await response.json();

            if (data.length > 0) {
                formattedChildren.push({
                    PARENT_NAME: childNode.PARENT_NAME,
                    COMPONENT_NAME: childNode.COMPONENT_NAME,
                    PART_NUMBER: data[0].PART_NUMBER,
                    TITLE: data[0].TITLE,
                    QUANTITY: childNode.QUANTITY,
                    TYPE: data[0].TYPE,
                    ITEM: data[0].ITEM,
                    MATERIAL: data[0].MATERIAL
                });
            }
        }));

        setColumns(formattedChildren);
    }

    // load Parts based on if node has children
    const loadRelatedParts = (node) => {
        if (node.children) {
            formatGridView(node.children);
        }
        else {
            setColumns([]);
        }
    }


    return (
        <div >
            <div style={{ padding: 10 }}>
                <div style={outerContainerStyle}>
                    <MyTreeView bom={bom} loadParts={loadRelatedParts} setPart={setCurrentPart} setParent={ setParentPart } />
                    <div style={innerContainerStyle}>
                        <p>Parent Child Part: {parentPart}</p>
                        <p>Current Part: {currentPart}</p>
                        <button onClick={() => { loadBOM() }} disabled={isBomLoaded} style={buttonStyle}> Populate Data In Tree</button>
                    </div>
                </div>
                <MyTable data={columns} />
            </div>
        </div>
    );
}

export default App;