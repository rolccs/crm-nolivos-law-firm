'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bell, User, LogOut, LogIn, UserPlus, Search, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  age: number;
  dob: string;
  status: 'active' | 'inactive';
  caseStatus: string;
  moreInfo: string;
}

interface User {
  username: string;
  password: string;
  displayName: string;
}

const users: User[] = [
  { username: 'hjnolivos', password: '6173', displayName: 'H. J. Nolivos' },
  { username: 'gnolivos', password: '5481', displayName: 'G. Nolivos' },
  { username: 'hnolivos', password: '3974', displayName: 'H. Nolivos' },
];

export function PagesIndex() {
  const [clients, setClients] = useState<Client[]>([]);

  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    pendingCases: 0
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newClient, setNewClient] = useState<Client>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    age: 0,
    dob: '',
    status: 'active',
    caseStatus: '',
    moreInfo: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const newId = (clients.length + 1).toString();
    setNewClient(prevClient => ({ ...prevClient, id: newId }));
  }, [clients.length]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.displayName}!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    setClients(prevClients => [...prevClients, newClient]);
    setStats(prevStats => ({
      ...prevStats,
      totalClients: prevStats.totalClients + 1,
      activeClients: newClient.status === 'active' ? prevStats.activeClients + 1 : prevStats.activeClients
    }));

    toast({
      title: "Client Created",
      description: `New client ${newClient.firstName} ${newClient.lastName} (ID: ${newClient.id}) has been added successfully.`,
    });

    setNewClient({
      id: (clients.length + 2).toString(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      state: '',
      age: 0,
      dob: '',
      status: 'active',
      caseStatus: '',
      moreInfo: ''
    });
  };

  const handleSearchClient = (e: React.FormEvent) => {
    e.preventDefault();
    const results = clients.filter(client => 
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    if (results.length === 0) {
      toast({
        title: "No Results",
        description: "No clients found matching your search criteria.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/noviloslawfirm-300x240-M1obKNP1sP9MwYn4bitgxrNgLpF0f2.png"
              alt="The Nolivos Law Firm Logo"
              width={150}
              height={120}
              className="mr-4"
            />
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={currentUser?.displayName} />
                  <AvatarFallback>{currentUser?.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Log In</DialogTitle>
                    <DialogDescription>
                      Enter your credentials to access the CRM system.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password" 
                      />
                    </div>
                    <Button type="submit" className="w-full">Log In</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {isLoggedIn ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <div className="space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create New Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Create New Client</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new client.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClient} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientId">Client ID</Label>
                        <Input 
                          id="clientId" 
                          value={newClient.id}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={newClient.firstName}
                            onChange={(e) => setNewClient({...newClient, firstName: e.target.value})}
                            placeholder="Enter first name" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={newClient.lastName}
                            onChange={(e) => setNewClient({...newClient, lastName: e.target.value})}
                            placeholder="Enter last name" 
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={newClient.email}
                          onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                          placeholder="Enter email" 
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            value={newClient.phone}
                            onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                            placeholder="Enter phone number" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            value={newClient.state}
                            onChange={(e) => setNewClient({...newClient, state: e.target.value})}
                            placeholder="Enter state" 
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input 
                            id="age" 
                            type="number"
                            value={newClient.age}
                            onChange={(e) => setNewClient({...newClient, age: parseInt(e.target.value)})}
                            placeholder="Enter age" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input 
                            id="dob" 
                            type="date"
                            value={newClient.dob}
                            onChange={(e) => setNewClient({...newClient, dob: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="status">Client Status</Label>
                          <Select onValueChange={(value) => setNewClient({...newClient, status: value as 'active' | 'inactive'})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="caseStatus">Case Status</Label>
                          <Input 
                            id="caseStatus" 
                            value={newClient.caseStatus}
                            onChange={(e) => setNewClient({...newClient, caseStatus: e.target.value})}
                            placeholder="Enter case status" 
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moreInfo">Additional Information</Label>
                        <Textarea 
                          id="moreInfo" 
                          value={newClient.moreInfo}
                          onChange={(e) => setNewClient({...newClient, moreInfo: e.target.value})}
                          placeholder="Enter additional information" 
                        />
                      </div>
                      <Button type="submit" className="w-full">Create Client</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Search className="mr-2 h-5 w-5" />
                      Consultar Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Consultar Cliente</DialogTitle>
                      <DialogDescription>
                        Buscar información del cliente por nombre o correo electrónico.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSearchClient} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="searchQuery">Buscar Cliente</Label>
                        <Input 
                          id="searchQuery" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Nombre o correo electrónico del cliente" 
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">Buscar</Button>
                    </form>
                    {searchResults.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Resultados de la búsqueda:</h3>
                        <ul className="space-y-2">
                          {searchResults.map((client) => (
                            <li key={client.id} className="bg-gray-100 p-4 rounded">
                              <h4 className="font-bold text-lg">{client.firstName} {client.lastName}</h4>
                              <p><strong>ID:</strong> {client.id}</p>
                              <p><strong>Email:</strong> {client.email}</p>
                              <p><strong>Teléfono:</strong> {client.phone}</p>
                              <p><strong>Estado:</strong> {client.state}</p>
                              <p><strong>Edad:</strong> {client.age}</p>
                              <p><strong>Fecha de Nacimiento:</strong> {client.dob}</p>
                              <p><strong>Estado del Cliente:</strong> {client.status}</p>
                              <p><strong>Estado del Caso:</strong> {client.caseStatus}</p>
                              <p><strong>Información Adicional:</strong> {client.moreInfo}</p>
                              <Link href={`/client/${client.id}`} className="text-blue-500 hover:underline mt-2 inline-block">
                                View Dashboard
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClients}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeClients}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Casos Pendientes</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingCases}</div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-xl font-semibold mb-4">Clientes Recientes</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <li key={client.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary truncate">{client.firstName} {client.lastName}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {client.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {client.email}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Link href={`/client/${client.id}`} className="text-blue-500 hover:underline flex items-center">
                            View Dashboard
                            <ExternalLink className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-88px)]">
            <div className="w-1/2 bg-gray-100 flex items-center justify-center p-12">
              <div className="max-w-md w-full">
                <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 animate-gradient-x">
                  Welcome to The Nolivos Law Firm CRM
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Streamline your client management and case tracking with our powerful CRM system.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">
                      <LogIn className="mr-2 h-5 w-5" />
                      Log In to Get Started
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Log In</DialogTitle>
                      <DialogDescription>
                        Enter your credentials to access the CRM system.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password" 
                        />
                      </div>
                      <Button type="submit" className="w-full">Log In</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="w-1/2 relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A_detailed_illustration_representing_an_immigratio-YGlAsGU99UouZArvdHYZc6jCU2H669.jpg"
                alt="CRM Background"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2023 The Nolivos Law Firm CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}