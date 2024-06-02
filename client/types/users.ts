export interface UserResponse {
    id:       number;
    name:     string;
    username: string;
    email:    string;
    phone:    string;
    website:  string;
    address:  Address;
    company:  Company;
}

export interface Address {
    geo:     Geo;
    city:    string;
    suite:   string;
    street:  string;
    zipcode: string;
}

export interface Geo {
    lat: string;
    lng: string;
}

export interface Company {
    bs:          string;
    name:        string;
    catchPhrase: string;
}