
"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useAuth } from "@/context/AuthContext"; // User role logic temporarily removed
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit3, Trash2, Phone, Landmark, PiggyBank, FileText, Info, UserCog, Percent } from "lucide-react";
import React, { useState, useEffect } from "react";

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
];

const initialMembersWithId: Member[] = initialMembersData.map((member, index) => ({
  ...member,
  id: `member-${Date.now()}-${index}`,
}));

const LOCAL_STORAGE_KEY_CONTRIBUTIONS = "photoVaultContributionsData";

export default function ContributionsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const { toast } = useToast();
  // const { user } = useAuth(); // Temporarily removed for Firebase Auth integration
  const isAdmin = false; // Temporarily set to false, making page read-only until roles are re-integrated

  useEffect(() => {
    const storedMembers = localStorage.getItem(LOCAL_STORAGE_KEY_CONTRIBUTIONS);
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    } else {
      setMembers(initialMembersWithId);
    }
  }, []);

  useEffect(() => {
    if (members.length > 0) { // Avoid saving empty initial state if it hasn't loaded yet
        localStorage.setItem(LOCAL_STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(members));
    }
  }, [members]);


  const handleInputChange = (memberId: string, fieldKey: keyof Omit<Member, 'id' | 'sn'>, rawValue: string) => {
    if (!isAdmin) return; // This will prevent changes since isAdmin is false

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
    if (!isAdmin) {
        toast({ title: "Permission Denied", description: "Editing features are temporarily disabled.", variant: "destructive"});
        return;
    }
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
      description: `New member (SN ${newSn}) added.`,
    });
  };

  const handleUpdateMember = (memberId: string) => {
    if (!isAdmin) {
        toast({ title: "Permission Denied", description: "Editing features are temporarily disabled.", variant: "destructive"});
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
        toast({ title: "Permission Denied", description: "Editing features are temporarily disabled.", variant: "destructive"});
        return;
    }
    const memberToDelete = members.find(m => m.id === memberId);
    setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
    toast({
      title: "Member Deleted (Local Data)",
      description: `Member ${memberToDelete?.name || ''} (SN ${memberToDelete?.sn || ''}) has been removed locally.`,
    });
  };


  return (
    <AppShell>
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle className="text-2xl font-headline">Member Contributions & Details</CardTitle>
                    <CardDescription>
                      View member details and financial records. Editing features are temporarily disabled pending role system update.
                    </CardDescription>
                </div>
                {isAdmin && ( // This button will be hidden as isAdmin is false
                    <Button 
                        onClick={handleAddMember} 
                        variant="default" 
                        className="bg-accent hover:bg-accent/90 text-accent-foreground sm:ml-auto"
                    >
                        <UserPlus className="mr-2 h-5 w-5" />
                        Add New Member
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/50 rounded-md">
                    <Info className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground">No Member Data</p>
                    <p className="text-muted-foreground mb-6">
                      {isAdmin ? "Click \"Add New Member\" to get started." : "No member data available to display."}
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
                  {members.map((member) => (
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
                                disabled={!isAdmin} // Will be disabled
                                >
                                <Edit3 className="mr-1 h-4 w-4" /> Update
                                </Button>
                                <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteMember(member.id)}
                                className="w-full sm:w-auto"
                                disabled={!isAdmin} // Will be disabled
                                >
                                <Trash2 className="mr-1 h-4 w-4" /> Delete
                                </Button>
                            </div>
                          ) : column.isEditable ? (
                            <Input
                              type={column.cellType === 'number' && column.accessorKey !== 'phone' ? 'number' : 'text'}
                              value={member[column.accessorKey as keyof Omit<Member, 'id'|'actions'>]}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleInputChange(member.id, column.accessorKey as keyof Omit<Member, 'id'|'sn'>, e.target.value);
                              }}
                              placeholder={column.placeholder}
                              className="w-full h-10"
                              readOnly={!isAdmin} // Will be read-only
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
