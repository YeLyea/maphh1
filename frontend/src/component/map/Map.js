import React from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ScaleControl, LayersControl, GeoJSON, Polyline } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import { Card, Dropdown, message, Space, Menu } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useState } from "react"
import { Icon, divIcon, point } from "leaflet"
import "./style.css"
import { Link } from 'react-router-dom'


// 朝代
const { SubMenu } = Menu

const dynastyData = [
  {
    name: '秦朝',
    markers: [
      {
        geocode: [35.86551745750154, 112.89308966258903],
        popUp:
          <Card
            // title="长平之战"
            bordered={false}
            style={{
              width: 300,
            }}
          >
            <Link to="/details/changping">长平之战</Link>
            <p>秦国和赵国</p>
            <p>白起，廉颇，赵括</p>
            <p>坑杀四十万降军</p>
          </Card>,
      },
      {
        geocode: [35.15704727806234, 111.22609610770537],
        popUp:
          <Card
            title="鸣条之战"
            bordered={false}
            style={{
              width: 300,
            }}
          >
            <p>商汤灭夏</p>
            <p>商汤夏桀</p>
            <p>公元前1600年</p>
          </Card>,
      },
    ],
  },
  {
    name: '汉朝',
    markers: [
      { geocode: [34.2297, 108.8736], popUp: '长安' },
      { geocode: [31.2085, 121.4737], popUp: '蓬莱塔' },
    ],
  },
  {
    name: '唐朝',
    markers: [
      { geocode: [34.2425, 108.9716], popUp: '大雁塔' },
      { geocode: [34.2159, 108.8642], popUp: '小雁塔' },
    ],
  },
]
// 多级菜单
const { BaseLayer } = LayersControl
// create custom icon
const customIcon = new Icon({
  // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconUrl: require("../../icons/swordred.png"),
  iconSize: [32, 32], // size of the icon
})

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  })
}

// markers
// const markers = [
//   {
//     geocode: [35.86551745750154, 112.89308966258903],
//     popUp:
//       <Card
//         title="长平之战"
//         bordered={false}
//         style={{
//           width: 300,
//         }}
//       >
//         <p>秦国和赵国</p>
//         <p>白起，廉颇，赵括</p>
//         <p>坑杀四十万降军</p>
//       </Card>,
//   },
//   {
//     geocode: [35.15704727806234, 111.22609610770537],
//     popUp:
//       <Card
//         title="鸣条之战"
//         bordered={false}
//         style={{
//           width: 300,
//         }}
//       >
//         <p>商汤灭夏</p>
//         <p>商汤夏桀</p>
//         <p>公元前1600年</p>
//       </Card>,
//   },
//   {
//     geocode: [48.855, 2.34],
//     popUp: "Hello, I am pop up 3"
//   }
// ]

function Map () {
  const [mapType, setMapType] = useState('terrain')
  const [selectedDynasty, setSelectedDynasty] = useState(dynastyData[0])
  const getJsonData = {
    "type": "Feature",
    "properties": {
      "name": "China"
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [[134.74, 48.37],
        [109.01, 2.52],
        [88.05, 27.92],
        [87.57, 49.15],
        [134.74, 48.37]]]
    }
  }
  const handleMapTypeChange = (event) => {
    setMapType(event.target.value)
  }

  const handleDynastyChange = (e) => {
    const selectedName = e.key
    const selectedDynasty = dynastyData.find((dynasty) => dynasty.name === selectedName)
    setSelectedDynasty(selectedDynasty)
  }

  const menu = (
    <Menu onClick={handleDynastyChange}>
      {dynastyData.map((dynasty) => (
        <Menu.Item key={dynasty.name}>{dynasty.name}</Menu.Item>
      ))}
    </Menu>
  )


  return (
    // 复选框
    <div className='kun'>
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          Select Dynasty
        </a>
      </Dropdown>
      <MapContainer center={[39.9165, 116.3971]} zoom={5} minZoom={4} maxZoom={18} style={{ height: '100%', width: '100%' }}>
        <LayersControl position="topright">
          <BaseLayer checked={mapType === 'terrain'} name="Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.tianditu.g5ov.cn">天地图</a> contributors'
              url="https://t{s}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=d8fefb022f0ed2742bdd3ffd8f9f0b78"
              subdomains={[1, 2, 3, 4, 5, 6, 7]}
            />
          </BaseLayer>
          <BaseLayer checked={mapType === 'imagery'} name="Imagery">
            <TileLayer
              attribution='&copy; <a href="https://www.tianditu.gov.cn">天地图</a> contributors'
              url="https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=d8fefb022f0ed2742bdd3ffd8f9f0b78"
              subdomains={[1, 2, 3, 4, 5, 6, 7]}
            />
          </BaseLayer>
          <BaseLayer checked={mapType === 'vec'} name="Vec">
            <TileLayer
              attribution='&copy; <a href="https://www.tianditu.gov.cn">天地图</a> contributors'
              url="https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=d8fefb022f0ed2742bdd3ffd8f9f0b78"
              subdomains={[1, 2, 3, 4, 5, 6, 7]}
            />
          </BaseLayer>
        </LayersControl>

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {/* Mapping through the markers */}
          {/* {markers.map((marker) => (
            <Marker position={marker.geocode} icon={customIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))} */}
          {selectedDynasty.markers.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={customIcon} >
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
          {selectedDynasty.name === "秦朝" && <Polyline positions={[[35.86551745750154, 112.89308966258903], [35.15704727806234, 111.22609610770537]]} color="red" weight={3} lineCap='round' lineJoin='miter' />}
        </MarkerClusterGroup>
        {/* <ZoomControl position="topright" /> */}
        <ScaleControl position="bottomleft" />
        <GeoJSON data={getJsonData} style={{ color: 'purple' }} />
        {/* <AttributionControl position="bottomright" /> */}
        {/* <LocationMarker /> */}
      </MapContainer>
    </div >
  )
}

export default Map

// functions
// function LocationMarker () {
//   const [position, setPosition] = useState(null)
//   const map = useMapEvents({
//     click () {
//       map.locate()
//     },
//     locationfound (e) {
//       setPosition(e.latlng)
//       map.flyTo(e.latlng, map.getZoom())
//     },
//   })

//   return position === null ? null : (
//     <Marker position={position} icon={customIcon}>
//       <Popup>You are here</Popup>
//     </Marker>
//   )
// }