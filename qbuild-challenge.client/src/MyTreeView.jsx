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

    useEffect(() => {
        if (bom.length > 0) {
            const roots = bom.filter(item => !bom.some(innerItem => innerItem.COMPONENT_NAME === item.PARENT_NAME));

            // Build the tree structure for each top-level node
            const tree = roots.map(root => ({
                ...root,
                children: buildTree(root.COMPONENT_NAME, bom),
            }));
            setTreeData(tree);
        }
        // Identify top-level nodes (nodes without parents)

    }, [bom])


    /**
     * Recursively builds a tree structure based on parent-child relationships in the data.
     * @param {string} parentName - The parent node's COMPONENT_NAME.
     * @param {Object[]} data - The array of objects representing the tree nodes.
     * @returns {Object[]} An array of nodes with their children.
     */
    const buildTree = (parentName, data) => {
        const children = data
            .filter(item => item.PARENT_NAME === parentName)
            .map(item => ({
                ...item,
                children: buildTree(item.COMPONENT_NAME, data),
            }));

        return children.length > 0 ? children : null;
    };

    /**
     * Recursively renders a tree structure using the TreeView and TreeItem components from Material-UI.
     * @param {Object[]} nodes - The array of nodes to render.
     * @returns {React.ReactNode} The rendered tree structure.
     */
    const renderTree = (nodes) => (
        nodes.map((node) => (
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
            defaultCollapseIcon={<span><KeyboardArrowDownIcon/></span>}
            defaultExpandIcon={<span><ChevronRightIcon /></span>}
        >
            {/* Render the top-level nodes and their children */}
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
            ))
            }
        </TreeView >
    );
};

export default MyTreeView;
