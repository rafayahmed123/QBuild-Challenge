/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const MyTreeView = ({ bom, loadParts, setPart }) => {
    const treeViewStyle = {
        border: '2px solid #000000',
        padding: '10px',
        maxHeight: 150,
        overflowY: 'auto',
        width: 600,
    };
    const [treeData, setTreeData] = useState([]);


    // Effect hook to update the treeData when the bom prop changes
    useEffect(() => {
        if (bom.length > 0) {
            const roots = bom.filter(item => !bom.some(innerItem => innerItem.COMPONENT_NAME === item.PARENT_NAME));
            const tree = roots.map(root => ({
                ...root,
                children: buildTree(root.COMPONENT_NAME, bom),
            }));

            setTreeData([...tree]);
        }
    }, [bom]);

    // Recursively builds a tree structure based on parent - child relationships in the data.
    const buildTree = (parentName, data) => {
        const children = data
            .filter(item => item.PARENT_NAME === parentName)
            .map(item => ({
                ...item,
                children: buildTree(item.COMPONENT_NAME, data),
            }));

        return children.length > 0 ? children : null;
    };

    // sorts nodes based on if they have children or not
    const sortChildren = (nodes) => {
        return nodes.sort((a, b) => {
            if (a.children && !b.children) {
                return -1; 
            }
            if (!a.children && b.children) {
                return 1; 
            }
            return 0;
        });
    };

    // Recursively renders a tree structure using the TreeView and TreeItem components from Material-UI
    const renderTree = (nodes) => (
        sortChildren(nodes).map((node) => (
            <TreeItem
                key={node.COMPONENT_NAME}
                nodeId={node.COMPONENT_NAME}
                label={node.COMPONENT_NAME}
                onClick={() => { loadParts(node); setPart(node.COMPONENT_NAME) }}
            >
                {node.children && renderTree(node.children)}
            </TreeItem>
        ))
    );

    return (
        <TreeView
            style={treeViewStyle}
            aria-label="parts-navigator"
            defaultCollapseIcon={<span><KeyboardArrowDownIcon /></span>}
            defaultExpandIcon={<span><ChevronRightIcon /></span>}
        >
            {treeData.length > 0 && treeData.map((node) => (
                <TreeItem
                    key={node.COMPONENT_NAME}
                    nodeId={node.COMPONENT_NAME}
                    label={node.COMPONENT_NAME}
                    onClick={() => {
                        loadParts(node);
                        setPart(node.COMPONENT_NAME)
                    }}
                >
                    {node.children && renderTree(node.children)}
                </TreeItem>
            ))}
        </TreeView>
    );
};

export default MyTreeView;
