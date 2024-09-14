import React from "react";
import { 
  ChartBarIcon,
  TableCellsIcon,
  ViewfinderCircleIcon,
} from '@heroicons/react/24/outline';
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import {
  Card, 
  CardBody, 
  Breadcrumbs, 
  BreadcrumbItem, 
  Tabs, 
  Tab,
} from "@nextui-org/react";

export default function DashboardPage() {
  return (
      <>
        <Card className="border border-primary rounded-md">
          <CardBody className="px-5">
            <h3 className="font-bold text-2xl tracking-normal text-primary">Dashboard</h3>
            <Breadcrumbs size="md" className="pt-2">
              <BreadcrumbItem>Home</BreadcrumbItem>
              <BreadcrumbItem>Music</BreadcrumbItem>
              <BreadcrumbItem>Artist</BreadcrumbItem>
              <BreadcrumbItem>Album</BreadcrumbItem>
              <BreadcrumbItem>Song</BreadcrumbItem>
            </Breadcrumbs>
          </CardBody>
        </Card>
        <Tabs className="pt-10" color="primary" radius="sm" size="lg" variant="bordered">
          <Tab key="overview" title={
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="size-5"/>
              <span className="mt-0.5">Overview</span>
            </div>
          }>
            <Card className="rounded-md">
              <CardBody>
                Konten Overview
              </CardBody>
            </Card>  
          </Tab>

          <Tab key="sebaran" title={
            <div className="flex items-center space-x-2">
              <ViewfinderCircleIcon className="size-5"/>
              <span className="mt-0.5">Data Sebaran B3</span>
            </div>
          }>
            <Card className="rounded-md">
              <CardBody>
                <MapContainer center={[-0.574469, 117.015867]} zoom={5} className="w-full h-[600px] z-10">
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
              </CardBody>
            </Card>  
          </Tab>

          <Tab key="table" title={
            <div className="flex items-center space-x-2">
              <TableCellsIcon className="size-5"/>
              <span className="mt-0.5">Tabel Data B3</span>
            </div>
          }>
            <Card className="rounded-md">
              <CardBody>
                Konten Tabel Data B3 
              </CardBody>
            </Card>  
          </Tab>
        </Tabs>
      </>
  );
}