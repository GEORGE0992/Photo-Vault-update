
"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit3, Trash2, Phone, Landmark, PiggyBank, FileText, Info, UserCog, Percent, Search, Filter as FilterIcon } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";

interface Member {
  id: string;
  sn: number;
  name: string;
  phone: string;
  amount: number;
  savings: number;
  loan: number;
  interest: number;
}

interface ColumnDefinition {
  accessorKey: keyof Member | 'actions';
  header: string;
  cellType?: 'text' | 'number' | 'actions';
  placeholder?: string;
  defaultValue?: string | number;
  isEditable?: boolean;
  icon?: React.ElementType;
  className?: string; 
}

// DESIGNATED ADMIN EMAILS - Add any email addresses that should have admin privileges
const ADMIN_EMAILS = ["admin@photovault.com", "george@photovault.com"];

const tableColumns: ColumnDefinition[] = [
  { accessorKey: "sn", header: "SN", cellType: "number", isEditable: false, className: "w-[60px]"},
  { accessorKey: "name", header: "Name", cellType: "text", placeholder: "Member Name", defaultValue: "", isEditable: true, icon: UserCog },
  { accessorKey: "phone", header: "Phone", cellType: "text", placeholder: "XXX-XXX-XXXX", defaultValue: "", isEditable: true, icon: Phone },
  { accessorKey: "amount", header: "Amount contributed", cellType: "number", placeholder: "0", defaultValue: 0, isEditable: true, icon: Landmark },
  { accessorKey: "savings", header: "Savings", cellType: "number", placeholder: "0", defaultValue: 0, isEditable: true, icon: PiggyBank },
  { accessorKey: "loan", header: "Loan", cellType: "number", placeholder: "0", defaultValue: 0, isEditable: true, icon: FileText },
  { accessorKey: "interest", header: "Interest", cellType: "number", placeholder: "0", defaultValue: 0, isEditable: true, icon: Percent },
  { accessorKey: "actions", header: "Actions", cellType: "actions", isEditable: false, className: "w-[200px]" },
];

const initialMembersData: Omit<Member, 'id'>[] = [
  { sn: 1, name: "Elizabeth", phone: "0745xxxx819", amount: 1124, savings: 1000, loan: 1000, interest: 133 },
  { sn: 2, name: "Felisters", phone: "0708xxxx139", amount: 1124, savings: 1000, loan: 0, interest: 0 },
  { sn: 3, name: "Purity", phone: "0707xxxx689", amount: 1124, savings: 1000, loan: 0, interest: 0 },
  { sn: 4, name: "Sharon", phone: "0793xxxx766", amount: 1124, savings: 1000, loan: 0, interest: 0 },
  { sn: 5, name: "Lydia", phone: "0714xxxx426", amount: 1124, savings: 1000, loan: 0, interest: 0 },
  { sn: 6, name: "Vallary", phone: "0790xxxx356", amount: 1124, savings: 1000, loan: 0, interest: 0 },
  { sn: 7, name: "Zakia", phone: "0748xxxx139", amount: 1124, savings: 1000, loan: 6000, interest: 666 },
  { sn: 8, name: "Oliver", phone: "0797xxxx989", amount: 1124, savings: 1000, loan: 0, interest: 0 },
  { sn: 9, name: "Syphrine", phone: "0799xxxx706", amount: 1124, savings: 1000, loan: 1000, interest: 352 },
  { sn: 10, name: "Phanice", phone: "0727xxxx111", amount: 1124, savings: 0, loan: 0, interest: 0 },
  { sn: 11, name: "George", phone: "0712xxxx345", amount: 1000, savings: 1000, loan: 0, interest: 0 },
];

const initialMembersWithId: Member[] = initialMembersData.map((member, index) => ({
  ...member,
  id: `member-${Date.now()}-${index}`, 
}));

const LOCAL_STORAGE_KEY_CONTRIBUTIONS = "photoVaultContributionsData";

export default function ContributionsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth(); 

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyWithLoan, setShowOnlyWithLoan] = useState(false);

  useEffect(() => {
    if (user?.email && ADMIN_EMAILS.includes(user.email)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    const storedMembers = localStorage.getItem(LOCAL_STORAGE_KEY_CONTRIBUTIONS);
    if (storedMembers) {
      try {
        const parsedMembers = JSON.parse(storedMembers);
        if (Array.isArray(parsedMembers)) {
          setMembers(parsedMembers);
        } else {
          setMembers(initialMembersWithId); 
        }
      } catch (error) {
        console.error("Failed to parse members from localStorage", error);
        setMembers(initialMembersWithId); 
      }
    } else {
      setMembers(initialMembersWithId);
    }
  }, []);

  useEffect(() => {
    if (members.length > 0 && members !== initialMembersWithId && JSON.stringify(members) !== JSON.stringify(initialMembersWithId)) {
        localStorage.setItem(LOCAL_STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(members));
    } else if (members.length === 0 && localStorage.getItem(LOCAL_STORAGE_KEY_CONTRIBUTIONS)) {
        // This condition might need adjustment based on desired behavior for "clearing all data"
    }
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearchTerm = searchTerm.trim() === "" ||
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLoanFilter = !showOnlyWithLoan || (showOnlyWithLoan && member.loan > 0);

      return matchesSearchTerm && matchesLoanFilter;
    });
  }, [members, searchTerm, showOnlyWithLoan]);


  const handleInputChange = (memberId: string, fieldKey: keyof Omit<Member, 'id' | 'sn'>, rawValue: string) => {
    if (!isAdmin) return;

    setMembers(prevMembers =>
      prevMembers.map(member => {
        if (member.id === memberId) {
          const columnDef = tableColumns.find(col => col.accessorKey === fieldKey);
          let processedValue: string | number = rawValue;

          if (columnDef?.cellType === 'number' && columnDef.accessorKey !== 'phone') {
            if (rawValue.trim() === "") {
              processedValue = columnDef.defaultValue as number ?? 0;
            } else {
              const numValue = parseFloat(rawValue);
              if (isNaN(numValue)) {
                processedValue = member[fieldKey as keyof Omit<Member, 'id' | 'sn'>]; 
                toast({
                  title: "Invalid Input",
                  description: `${columnDef.header} must be a number. Reverting to previous value.`,
                  variant: "destructive",
                });
              } else {
                processedValue = numValue;
              }
            }
          }
          return { ...member, [fieldKey]: processedValue };
        }
        return member;
      })
    );
  };

  const handleAddMember = () => {
    // Any authenticated user can add a new member
    const newMemberId = `member-${Date.now()}-${members.length}`;
    const newSn = members.length > 0 ? Math.max(...members.map(m => m.sn)) + 1 : 1;

    const newMember: Member = {
      id: newMemberId,
      sn: newSn,
      name: tableColumns.find(c => c.accessorKey === 'name')?.defaultValue as string ?? "",
      phone: tableColumns.find(c => c.accessorKey === 'phone')?.defaultValue as string ?? "",
      amount: tableColumns.find(c => c.accessorKey === 'amount')?.defaultValue as number ?? 0,
      savings: tableColumns.find(c => c.accessorKey === 'savings')?.defaultValue as number ?? 0,
      loan: tableColumns.find(c => c.accessorKey === 'loan')?.defaultValue as number ?? 0,
      interest: tableColumns.find(c => c.accessorKey === 'interest')?.defaultValue as number ?? 0,
    };

    setMembers(prevMembers => [...prevMembers, newMember]);
    toast({
      title: "Member Added",
      description: `New member (SN ${newSn}) added. Please fill in their details.`,
    });
  };

  const handleUpdateMember = (memberId: string) => {
    if (!isAdmin) { 
        toast({ title: "Permission Denied", description: "You do not have permission to update members.", variant: "destructive"});
        return;
    }
    const memberToUpdate = members.find(m => m.id === memberId);
    if (!memberToUpdate) return;

    if (!memberToUpdate.name || String(memberToUpdate.name).trim() === "") {
      toast({ title: "Validation Error", description: "Member name cannot be empty.", variant: "destructive" });
      return;
    }
    const phoneString = String(memberToUpdate.phone).trim();
    if (phoneString && !/^0\d{9}$/.test(phoneString) && !/^\d{3}-\d{3}-\d{4}$/.test(phoneString)) {
        toast({ title: "Validation Error", description: "Phone number must be in 0XXXXXXXXX or XXX-XXX-XXXX format, or empty.", variant: "destructive" });
        return;
    }
    
    console.log("Updating member (local data):", memberToUpdate); 
    toast({
      title: "Update Successful (Local Data)",
      description: `Data for ${memberToUpdate.name} (SN ${memberToUpdate.sn}) has been updated locally.`,
    });
  };

  const handleDeleteMember = (memberId: string) => {
    if (!isAdmin) {
        toast({ title: "Permission Denied", description: "You do not have permission to delete members.", variant: "destructive"});
        return;
    }
    const memberToDelete = members.find(m => m.id === memberId);
    setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
    toast({
      title: "Member Deleted (Local Data)",
      description: `Member ${memberToDelete?.name || ''} (SN ${memberToDelete?.sn || ''}) has been removed locally.`,
    });
  };

  const hasActiveFilters = searchTerm.trim() !== "" || showOnlyWithLoan;

  return (
    <AppShell>
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle className="text-2xl font-headline">Member Contributions & Details</CardTitle>
                    <CardDescription>
                      {isAdmin 
                        ? "Manage member details and financial records. All members can add new entries." 
                        : "View member details and financial records. You can add new entries. Editing and deleting existing records are features available for administrators."
                      }
                    </CardDescription>
                </div>
                <Button 
                    onClick={handleAddMember} 
                    variant="default" 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground sm:ml-auto"
                >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Add New Member
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters Section */}
            <Card className="mb-6 bg-muted/30 shadow-sm border">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center">
                        <FilterIcon className="mr-2 h-5 w-5 text-primary" />
                        Filter Members
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div>
                            <Label htmlFor="search-member" className="text-sm font-medium">Search by Name/Phone</Label>
                             <div className="relative mt-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="search-member"
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-2 md:pt-0 md:self-end md:pb-1">
                            <Checkbox
                                id="filter-loan"
                                checked={showOnlyWithLoan}
                                onCheckedChange={(checked) => setShowOnlyWithLoan(Boolean(checked))}
                            />
                            <Label htmlFor="filter-loan" className="text-sm font-medium">
                                Has Outstanding Loan
                            </Label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Contribution Level</Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                (e.g., All Contributions, Above Average, etc. - Future filter)
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Savings Level</Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                (e.g., All Savings, Top Savers, etc. - Future filter)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Section */}
            {filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/50 rounded-md">
                    <Info className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground">
                        {hasActiveFilters ? "No Members Match Filters" : "No Member Data"}
                    </p>
                    <p className="text-muted-foreground mb-6">
                      {hasActiveFilters 
                        ? "Try adjusting your search or filter criteria."
                        : 'Click "Add New Member" to get started.'}
                    </p>
                </div>
            ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    {tableColumns.map(column => (
                      <TableHead key={column.accessorKey} className={`p-2 bg-muted align-top ${column.className || ''}`}>
                         <div className="flex items-center h-10">
                            {column.icon && <column.icon className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />}
                            {column.header}
                         </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      {tableColumns.map(column => (
                        <TableCell key={`${member.id}-${column.accessorKey}`} className={`p-2 align-top ${column.className || ''}`}>
                          {column.cellType === 'actions' ? (
                            <div className="flex flex-col sm:flex-row gap-2 items-start h-10">
                                <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleUpdateMember(member.id)}
                                className="w-full sm:w-auto"
                                disabled={!isAdmin}
                                >
                                <Edit3 className="mr-1 h-4 w-4" /> Update
                                </Button>
                                <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteMember(member.id)}
                                className="w-full sm:w-auto"
                                disabled={!isAdmin}
                                >
                                <Trash2 className="mr-1 h-4 w-4" /> Delete
                                </Button>
                            </div>
                          ) : column.isEditable ? (
                            <Input
                              type={column.cellType === 'number' && column.accessorKey !== 'phone' ? 'number' : 'text'}
                              value={member[column.accessorKey as keyof Omit<Member, 'id'|'actions'>]}
                              onChange={(e) => {
                                const isNewUnsavedMember = !initialMembersData.some(im => im.name === member.name && im.phone === member.phone);
                                if (isAdmin || (isNewUnsavedMember && member.name === "" ) ) { 
                                   handleInputChange(member.id, column.accessorKey as keyof Omit<Member, 'id'|'sn'>, e.target.value);
                                }
                              }}
                              placeholder={column.placeholder}
                              className="w-full h-10"
                              readOnly={!isAdmin && !(member.name === (tableColumns.find(c => c.accessorKey === 'name')?.defaultValue as string ?? "") && column.accessorKey !== 'sn')}
                            />
                          ) : (
                             <div className="flex items-center h-10">
                                {String(member[column.accessorKey as keyof Member])}
                             </div>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}


    