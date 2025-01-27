import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import EditingPopUp from "./EditingPopUp";


function SidebarComponent({ id, title }) {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("componentId", id)}
      style={{
        margin: "10px",
        padding: "10px",
        border: "1px solid black",
        borderRadius: "5px",
        backgroundColor: "#f0f0f0",
        cursor: "grab",
      }}
    >
      {title}
    </div>
  );
}

function BoxComponent({
  id,
  position = { x: 0, y: 0 }, // Prevent undefined position error
  width,
  content,
  customStyle,
  onResizeStop,
  isResizing,
  setIsResizing,
  minWidth,item_id,fetchLayout,setEditStyling,setItemId
}) {
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `layout-${id}`,
    disabled: isResizing, // Prevent dragging while resizing
  });

  const style = {
    position: 'absolute',
    left: `${position.x}px`, // Set x position in pixels
    top: `${position.y}px`, // Set y position in pixels
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    display: 'flex',
    background: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxSizing: 'border-box',
    border: '1px solid black',
    overflow:'hidden',
    ...customStyle, // Apply custom style if provided
  };

  const onDelete=async(item)=>{
   
    try {
      const response = await fetch('http://localhost:5000/layout/delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item })  // Send the layout in the request body
      });
      const data = await response.json();
      fetchLayout()
      console.log('Layout saved successfully:', data);
    } catch (err) {
      console.error('Error saving layout:', err);
    }
  }


  return (
    <ResizableBox
      width={parseInt(width)}
      // height={150}
      axis="x"
      resizeHandles={["se"]}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={(event, { size }) => {
        onResizeStop(id, size.width);
        setIsResizing(false);
      }}
      minConstraints={[minWidth, 50]}
      style={style}
    >
      <div ref={setNodeRef} {...listeners} {...attributes}>
        {content}
      </div>
      <div style={{ cursor: 'pointer',border:'none',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',
          position:'absolute',top:'0px',right:'0px'
         }}>
      <button
      
        style={{ width:'24px',height:'24px',border:'none',display:'flex',alignItems:'center',justifyContent:'center'
         }} onClick={()=>{setEditStyling(true);setItemId(item_id)}}
      >
        <img style={{ width:'24px',height:'24px'
         }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwfCYJZooXUxEEzGXtHy8WxSHw6jhvjv5o3A&s" alt="delete"/>
      </button>
      <button
        onClick={() => onDelete(item_id)}
        style={{ width:'24px',height:'24px',border:'none',display:'flex',alignItems:'center',justifyContent:'center'
         }}
      >
        <img src="https://marathon-web-assets.s3.ap-south-1.amazonaws.com/attri-delete.png" alt="delete"/>
      </button>
      </div>
     
    </ResizableBox>
  );
}


function App() {
  const [layout, setLayout] = useState([]);
  const [isResizing, setIsResizing] = useState(false);
  const [editStyling, setEditStyling] = useState(false);
  const [activeDrag, setActiveDrag] = useState(null);
  const [itemId, setItemId] = useState('');
// itemId
  const availableComponents = [
    { id: 1, title: "Company Details", minWidth: 400 },
    { id: 2, title: "Supplier Details", minWidth: 400 },
    { id: 3, title: "Default Details", minWidth: 400 },
    { id: 4, title: "Custom Details", minWidth: 400 },
    { id: 5, title: "Item Table", minWidth: 700 },
    { id: 6, title: "Terms and Conditions", minWidth: 700 },
  ];

  const dynamicContent = (boxId,box) => {
    switch (boxId) {
      case 1:
        return (
          <div style={{  display: 'flex', flexDirection: 'column', 
          alignItems:  box.styles?.text_align || 'left', justifyContent:  box.styles?.text_align || 'left',
          background: box.styles?.background_color || 'white', // Default to white if undefined
    color: box.styles?.color || 'black', // Default to black if undefined
    textAlign: box.styles?.text_align || 'left' }}>
            <img src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/m-logo.svg'
              width='50px' height='50px' />
            <span>Marathon</span>
            <address>Supplier Details</address>

          </div>
        );
      case 2:
        return (
          <div style={{  display: 'flex', flexDirection: 'column', paddingLeft: '20px', boxSizing: 'border-box'
            ,
          background: box.styles?.background_color || 'white', // Default to white if undefined
    color: box.styles?.color || 'black', // Default to black if undefined
    textAlign: box.styles?.text_align || 'left'
           }}>
            <span>VENDOR DETAILS:</span>
            <span>Supplier name : abcd</span>
            <span>Supplier email : abcd@gmail.com</span>
            <span>Supplier pincode : 123456</span>
            <span>Supplier phone number : 1234567890</span>

          </div>
        );
      case 3:
        return (
          <div style={{  display: 'flex', flexDirection: 'column', paddingLeft: '20px', boxSizing: 'border-box'
            ,
          background: box.styles?.background_color || 'white', // Default to white if undefined
    color: box.styles?.color || 'black', // Default to black if undefined
    textAlign: box.styles?.text_align || 'left'
           }}>
            <span>Default details:</span>
            <span>Supplier name : abcd</span>
            <span>Supplier email : abcd@gmail.com</span>
            <span>Supplier pincode : 123456</span>
            <span>Supplier phone number : 1234567890</span>

          </div>
        );
      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px', boxSizing: 'border-box'
            ,
          background: box.styles?.background_color || 'white', // Default to white if undefined
    color: box.styles?.color || 'black', // Default to black if undefined
    textAlign: box.styles?.text_align || 'left'
           }}>
            <span>Custom details:</span>
            <span>Supplier name : abcd</span>
            <span>Supplier email : abcd@gmail.com</span>
            <span>Supplier pincode : 123456</span>
            <span>Supplier phone number : 1234567890</span>

          </div>
        );
      case 5:
        return (<div style={{  display: 'flex', flexDirection: 'column', paddingLeft: '20px', boxSizing: 'border-box'
          ,
          background: box.styles?.background_color || 'white', // Default to white if undefined
    color: box.styles?.color || 'black', // Default to black if undefined
    textAlign: box.styles?.text_align || 'left'
         }}>
          <span>Item table</span>
          <table>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Part Number</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Cost Per Unit</th>
                <th>GST</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>PN12345</td>
                <td>Part A Description</td>
                <td>10</td>
                <td>50</td>
                <td>18%</td>
                <td>590</td>
              </tr>


            </tbody>
          </table>


        </div>);
      case 6:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px', boxSizing: 'border-box'
            ,
          background: box.styles?.background_color || 'white', // Default to white if undefined
    color: box.styles?.color || 'black', // Default to black if undefined
    textAlign: box.styles?.text_align || 'left'
           }}>
            <span>Terms and conditions</span>
            <span>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
              .</span>


          </div>
        );
      default:
        return <span>No content available</span>;
    }
  };

  const handleDragStart = (event) => {
    const activeId = String(event.active.id).replace("layout-", "");
    const activeBox = layout.find((box) => box.id === parseInt(activeId, 10));
    setActiveDrag(activeBox);
  };
  const fetchLayout = async () => {
    try {
      const response = await fetch('http://localhost:5000/layout/get-layout');
      const { data } = await response.json();
      if (data) {
        console.log('Fetched layout data:', data);  // Add this line to check the data
        setLayout(data.map(item => ({
          item_id: item._id,
          id: item.position_num,
          x: parseInt(item.x_direction, 10),
          y: parseInt(item.y_direction, 10),
          width: parseInt(item.width, 10),
          minWidth: item.min_width,
          title: `Component ${item.position_num}`,
          styles:item.styles  // You can modify this based on your logic
        })));
      }
    } catch (err) {
      console.error('Error fetching layout:', err);
    }
  };
  useEffect(() => {
    // Fetch layout from backend when the component loads
    


    fetchLayout();
  }, []);

  const saveLayout = async () => {
        try {
          const response = await fetch('http://localhost:5000/layout/create-layout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ layout })  // Send the layout in the request body
          });
          const data = await response.json();
          console.log('Layout saved successfully:', data);
        } catch (err) {
          console.error('Error saving layout:', err);
        }
      };
  // useEffect(() => {
  //   // Save layout to backend whenever it changes
  //   const saveLayout = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/layout/create-layout', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ layout })  // Send the layout in the request body
  //       });
  //       const data = await response.json();
  //       console.log('Layout saved successfully:', data);
  //     } catch (err) {
  //       console.error('Error saving layout:', err);
  //     }
  //   };

  //   if (layout.length > 0) {
  //     saveLayout();
  //   }
  // }, [layout]);

  const handleDragEnd = (event) => {
    const activeId = String(event.active.id).replace("layout-", "");
    const { delta } = event;

    setLayout((prevLayout) =>
      prevLayout.map((box) =>
        box.id === parseInt(activeId, 10)
          ? { ...box, x: box.x + delta.x, y: box.y + delta.y }
          : box
      )
    );

    setActiveDrag(null);
  };


  const handleDrop = (e) => {
    e.preventDefault();
    const componentId = parseInt(e.dataTransfer.getData("componentId"), 10);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (layout.find((box) => box.id === componentId)) {
      alert("This component is already added to the layout.");
      return;
    }

    const component = availableComponents.find((comp) => comp.id === componentId);
    if (component) {
      setLayout((prevLayout) => [
        ...prevLayout,
        {
          id: component.id,
          x,
          y,
          width: component.minWidth,
          title: component.title,
          minWidth: component.minWidth,
        },
      ]);
    }
  };

  const handleResizeStop = (id, newWidth) => {
    setLayout((prevLayout) =>
      prevLayout.map((box) =>
        box.id === id ? { ...box, width: newWidth.toString() } : box
      )
    );
  };

  const { setNodeRef } = useDroppable({ id: "layout-area" });
  const componentsNotInLayout = availableComponents.filter(
    (component) => !layout.some((box) => box.id === component.id)
  );

  return (
    <>
     <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

<div
  style={{
    width: "20%",
    padding: "10px",
    borderRight: "1px solid #ccc",
    backgroundColor: "#f8f8f8",
  }}
>
  {componentsNotInLayout.map((component) => (
    <SidebarComponent key={component.id} {...component} />
  ))}
</div>


<DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} >
  <button style={{position:'absolute',top:'10px',right:'10px',zIndex:'100'}} onClick={()=>saveLayout()}>Save</button>
  <div
    ref={setNodeRef}
    onDrop={handleDrop}
    onDragOver={(e) => e.preventDefault()}
    style={{
      position: "relative",
      width: "80%",
      height: "100%",
      overflow: "hidden",
      backgroundColor: "#fff",
    }}
  >

    {layout.map((box) => (
      <BoxComponent
        key={box.id}
        id={box.id}
        position={{ x: box.x, y: box.y }}
        width={box.width}
        content={dynamicContent(box.id,box)}
        customStyle={{}}
        onResizeStop={handleResizeStop}
        isResizing={isResizing}
        setIsResizing={setIsResizing}
        minWidth={box.minWidth}
        item_id={box.item_id}
        fetchLayout={fetchLayout}
        setEditStyling={setEditStyling}
        setItemId={setItemId}
      />
    ))}
  </div>


</DndContext>
</div>
{editStyling && <EditingPopUp editStyling={setEditStyling} layout={layout} item_id={itemId} setLayout={setLayout}/>}
    
    </>
   
  );
}

export default App;
